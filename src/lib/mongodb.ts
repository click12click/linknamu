import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

// MONGODB_URI 가 비어 있으면 클라이언트를 만들지 않고 null 을 돌려준다.
// 개발 단계에서 DB 없이도 페이지와 API 가 동작하게 하기 위함.
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "linknamu";

declare global {
  // 핫 리로드 시 커넥션이 누적되는 것을 막기 위한 전역 캐시.
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// dev 환경에서 mongodb+srv:// 의 SRV / TXT 를 우리가 직접 풀어 일반
// mongodb:// 시드리스트로 변환한다. 로컬 / ISP DNS 가 SRV 질의를 거부해
// querySrv ECONNREFUSED 가 뜨는 환경(예: 일부 한국 ISP) 우회용.
// 드라이버의 자체 DNS 경로를 아예 타지 않도록 변환된 URI 만 넘긴다.
async function expandSrvUri(srvUri: string): Promise<string> {
  const url = new URL(srvUri);
  const host = url.hostname;

  // 시스템 DNS 가 127.0.0.1 같은 무응답 주소로 잡혀 있어도 안전하게 풀리도록
  // 공용 리졸버로 명시 지정.
  const resolver = new dns.promises.Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);

  const [srvRecords, txtRecords] = await Promise.all([
    resolver.resolveSrv(`_mongodb._tcp.${host}`),
    resolver.resolveTxt(host).catch(() => [] as string[][]),
  ]);

  const seedlist = srvRecords.map((r) => `${r.name}:${r.port}`).join(",");

  // 옵션 우선순위: 기본값(ssl=true) < TXT(replicaSet/authSource) < 사용자 URI 옵션
  const params = new URLSearchParams();
  params.set("ssl", "true");
  new URLSearchParams(txtRecords.flat().join("&")).forEach((v, k) => {
    params.set(k, v);
  });
  new URLSearchParams(url.search).forEach((v, k) => {
    params.set(k, v);
  });

  const auth = url.username ? `${url.username}:${url.password}@` : "";
  const pathname = url.pathname || "/";
  return `mongodb://${auth}${seedlist}${pathname}?${params.toString()}`;
}

async function buildClient(): Promise<MongoClient> {
  if (!uri) throw new Error("MONGODB_URI not set");
  const finalUri =
    process.env.NODE_ENV === "development" && uri.startsWith("mongodb+srv://")
      ? await expandSrvUri(uri)
      : uri;
  return new MongoClient(finalUri).connect();
}

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = buildClient();
    }
    return global._mongoClientPromise;
  }

  return buildClient();
}

export async function getDb(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) return null;
  const client = await promise;
  return client.db(dbName);
}
