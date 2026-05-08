import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

// 모든 링크의 누적 클릭 수를 한 번에 돌려준다. 페이지 첫 로드 시 1회 호출.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // DB 가 닿지 않거나 (URI 미설정 / DNS 실패 / 네트워크 단절) 쿼리가 실패해도
  // 페이지가 0회 로 떨어지는 게 더 자연스럽다. 그래서 모든 실패는 빈 counts 로 흡수한다.
  try {
    const db = await getDb();
    if (!db) {
      return NextResponse.json({ counts: {} });
    }

    const docs = await db
      .collection("clicks")
      .find({}, { projection: { _id: 1, count: 1 } })
      .toArray();

    const counts: Record<string, number> = {};
    for (const doc of docs) {
      // _id 는 POST 핸들러에서 문자열로 upsert 했으므로 string 만 추린다.
      if (typeof doc._id === "string") {
        const raw = (doc as { count?: number }).count;
        counts[doc._id] = typeof raw === "number" ? raw : 0;
      }
    }

    return NextResponse.json({ counts });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[clicks] failed to load counts:", err);
    }
    return NextResponse.json({ counts: {} });
  }
}
