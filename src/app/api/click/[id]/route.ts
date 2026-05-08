import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// Edge 가 아닌 Node 런타임에서 mongodb 드라이버를 사용한다.
export const runtime = "nodejs";

// 임의의 경로 입력으로 컬렉션에 쓰레기 _id 가 쌓이지 않도록 형식만 강제한다.
const idPattern = /^[a-zA-Z0-9_-]{1,64}$/;

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!idPattern.test(id)) {
    return NextResponse.json({ ok: false, error: "invalid id" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) {
    // MONGODB_URI 미설정 — 개발 편의를 위해 성공으로 응답한다.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[click] MONGODB_URI not set; click for "${id}" not persisted`);
    }
    return NextResponse.json({ ok: true, persisted: false });
  }

  await db.collection("clicks").updateOne(
    { _id: id as unknown as never },
    { $inc: { count: 1 }, $set: { lastClickedAt: new Date() } },
    { upsert: true }
  );

  return NextResponse.json({ ok: true, persisted: true });
}
