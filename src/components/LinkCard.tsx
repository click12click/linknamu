"use client";

// 링크 카드 한 장. 클릭 집계는 새 탭 이동을 막지 않도록 비동기로 쏜다.
type LinkCardProps = {
  link: {
    id: string;
    title: string;
    url: string;
    emoji?: string;
  };
};

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

export default function LinkCard({ link }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => recordClick(link.id)}
      className="flex w-full items-center justify-center gap-3 rounded-2xl border border-white/60 bg-white/40 px-5 py-4 text-base font-medium text-stone-800 shadow-[0_8px_24px_-12px_rgba(120,70,30,0.25)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/55 active:translate-y-0"
    >
      {link.emoji ? (
        <span aria-hidden className="text-lg leading-none">
          {link.emoji}
        </span>
      ) : null}
      <span>{link.title}</span>
    </a>
  );
}
