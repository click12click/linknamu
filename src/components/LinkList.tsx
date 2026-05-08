"use client";

import { useEffect, useState } from "react";
import LinkCard from "./LinkCard";

type Link = {
  id: string;
  title: string;
  url: string;
  emoji?: string;
};

// 클릭 집계 — 새 탭 이동을 막지 않도록 비동기로 쏜다.
function recordClick(id: string) {
  const url = `/api/click/${encodeURIComponent(id)}`;
  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    try {
      navigator.sendBeacon(url);
      return;
    } catch {
      // sendBeacon 실패 시 fetch 로 폴백.
    }
  }
  fetch(url, { method: "POST", keepalive: true }).catch(() => {
    // 집계 실패가 사용자 이동을 막아서는 안 된다.
  });
}

export default function LinkList({ links }: { links: Link[] }) {
  // counts[id] 가 없으면 카드에서 0회 로 떨어진다 — 첫 페인트도 그래서 자연스럽다.
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/clicks")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { counts?: Record<string, number> } | null) => {
        if (cancelled || !data?.counts) return;
        setCounts(data.counts);
      })
      .catch(() => {
        // 네트워크 실패 시 0회 그대로 — 빈 칸보다 안정적이다.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 카드를 누르면 DB 증가와 동시에 화면 숫자도 1 올린다 (낙관적 업데이트).
  // 새 탭으로 떠난 뒤 돌아왔을 때 카운트가 그대로 보이는 어색함을 막는다.
  const handleClick = (id: string) => {
    recordClick(id);
    setCounts((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  return (
    <ul className="mt-12 flex w-full flex-col gap-4">
      {links.map((link) => (
        <li key={link.id}>
          <LinkCard
            link={link}
            count={counts[link.id] ?? 0}
            onClick={() => handleClick(link.id)}
          />
        </li>
      ))}
    </ul>
  );
}
