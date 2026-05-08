import LinkCard from "@/components/LinkCard";

// 진짜 내용으로 바꿀 때는 아래 두 상수만 수정하면 된다.
const profile = {
  name: "김개발",
  bio: "풀스택 개발자 | 요즘에는 AI 개발에 관심이 많아요",
  // 원형 프로필 사진 (150x150)
  avatarUrl: "https://placehold.co/150x150/orange/white",
};

const links = [
  {
    id: "github",
    title: "깃허브",
    url: "https://github.com/click12click",
    emoji: "🐙",
  },
  {
    id: "blog",
    title: "블로그",
    url: "https://www.gilbut.co.kr/",
    emoji: "✍️",
  },
  {
    id: "email",
    title: "이메일",
    url: "mailto:click12click@gmail.com",
    emoji: "📬",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 py-16 sm:py-20">
      <header className="flex flex-col items-center text-center">
        {/* 원형 프로필 사진 — 흰색 보더 + 따뜻한 톤의 2단 그림자로 살짝 입체감 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatarUrl}
          alt={`${profile.name} 프로필 사진`}
          width={144}
          height={144}
          className="h-36 w-36 rounded-full object-cover ring-1 ring-white/70 shadow-[0_18px_40px_-18px_rgba(180,100,40,0.45),0_4px_10px_rgba(0,0,0,0.06)]"
        />
        {/* 이름 */}
        <h1 className="mt-6 text-2xl font-bold tracking-tight text-stone-900">
          {profile.name}
        </h1>
        {/* 한 줄 소개 */}
        <p className="mt-2 text-sm text-stone-600">
          {profile.bio}
        </p>
      </header>

      {/* 링크 카드 목록 — 카드 사이 간격은 4 (16px), 글래스 효과가 잘 보이도록 충분히 띄움 */}
      <ul className="mt-12 flex w-full flex-col gap-4">
        {links.map((link) => (
          <li key={link.id}>
            <LinkCard link={link} />
          </li>
        ))}
      </ul>

      <footer className="mt-14 text-xs text-stone-500/80">
        © {new Date().getFullYear()} 링크나무
      </footer>
    </main>
  );
}
