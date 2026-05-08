"use client";

// 링크 카드 한 장. 클릭 집계와 카운트 상태는 부모(LinkList) 가 들고 있다.
type LinkCardProps = {
  link: {
    id: string;
    title: string;
    url: string;
    emoji?: string;
  };
  count?: number;
  onClick?: () => void;
};

export default function LinkCard({ link, count = 0, onClick }: LinkCardProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="relative flex w-full items-center justify-center gap-3 rounded-2xl border border-white/60 bg-white/40 px-5 py-4 text-base font-medium text-stone-800 shadow-[0_8px_24px_-12px_rgba(120,70,30,0.25)] backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:bg-white/55 active:translate-y-0"
    >
      {link.emoji ? (
        <span aria-hidden className="text-lg leading-none">
          {link.emoji}
        </span>
      ) : null}
      <span>{link.title}</span>
      {/* 카운트는 우측에 절대 배치 — 제목은 그대로 카드 가운데에 둔다.
          tabular-nums 로 숫자 폭을 고정해 1→2→10 으로 변할 때 흔들림이 없다. */}
      <span
        aria-label={`클릭 수 ${count}회`}
        className="absolute right-5 top-1/2 -translate-y-1/2 text-xs font-normal tabular-nums text-stone-500"
      >
        {count.toLocaleString("ko-KR")}회
      </span>
    </a>
  );
}
