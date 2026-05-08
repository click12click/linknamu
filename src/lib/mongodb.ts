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

function getClientPromise(): Promise<MongoClient> | null {
  if (!uri) return null;

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }

  return new MongoClient(uri).connect();
}

export async function getDb(): Promise<Db | null> {
  const promise = getClientPromise();
  if (!promise) return null;
  const client = await promise;
  return client.db(dbName);
}
