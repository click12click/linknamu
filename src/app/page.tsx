import LinkCard from "@/components/LinkCard";

// 진짜 내용으로 바꿀 때는 아래 두 상수만 수정하면 된다.
const profile = {
  name: "김클로",
  bio: "세계 최강 바이브 코더",
  // 더미 아바타 (DiceBear). 본인 사진 URL 또는 /public 경로로 교체.
  avatarUrl:
    "https://api.dicebear.com/9.x/thumbs/svg?seed=linknamu&backgroundColor=b6e3f4",
};

const links = [
  { id: "github", title: "GitHub", url: "https://github.com/" },
  { id: "linkedin", title: "LinkedIn", url: "https://www.linkedin.com/" },
  { id: "blog", title: "Blog", url: "https://example.com/blog" },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-5 py-12 sm:py-16">
      <header className="flex flex-col items-center text-center">
        {/* 원형 프로필 사진 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatarUrl}
          alt={`${profile.name} 프로필 사진`}
          width={144}
          height={144}
          className="h-36 w-36 rounded-full object-cover ring-2 ring-black/10 dark:ring-white/15"
        />
        {/* 이름 */}
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          {profile.name}
        </h1>
        {/* 한 줄 소개 */}
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          {profile.bio}
        </p>
      </header>

      {/* 링크 카드 목록 */}
      <ul className="mt-8 flex w-full flex-col gap-5">
        {links.map((link) => (
          <li key={link.id}>
            <LinkCard link={link} />
          </li>
        ))}
      </ul>

      <footer className="mt-10 text-xs text-black/40 dark:text-white/40">
        © {new Date().getFullYear()} 링크나무
      </footer>
    </main>
  );
}
