# 링크나무

내 모든 링크를 한 페이지에 모아두고, 하나의 URL로 공유하는 서비스입니다.

## 기술 스택
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- MongoDB Atlas (링크별 클릭 수 저장)
- Vercel (배포)

## 시작하기

```bash
npm install
cp .env.local.example .env.local   # MongoDB 사용 시 MONGODB_URI 채우기
npm run dev
```

브라우저에서 http://localhost:3000 을 연다.

> `MONGODB_URI` 가 비어 있어도 페이지와 `/api/click/[id]` 는 동작한다.
> 다만 클릭 수가 저장되지 않고 서버 콘솔에 경고만 찍힌다.

## 디렉터리 구조

```
src/
  app/
    api/click/[id]/route.ts   # 링크 클릭 수 집계 API
    layout.tsx                # 루트 레이아웃 (한국어, 메타데이터)
    page.tsx                  # 프로필 + 링크 목록
    globals.css
  components/
    Profile.tsx               # 프로필 사진 / 이름 / 한 줄 소개
    LinkCard.tsx              # 단일 링크 카드 (클릭 집계 포함)
    LinkList.tsx              # 링크 카드 목록
  lib/
    profile.ts                # 프로필 데이터
    links.ts                  # 링크 카드 데이터
    mongodb.ts                # MongoDB 클라이언트 헬퍼
```

## 데이터 수정

- 프로필: `src/lib/profile.ts` 의 `profile` 객체
- 링크 목록: `src/lib/links.ts` 의 `links` 배열 (`id` 는 클릭 집계 키이므로 변경 시 기존 카운트와 분리됨)

## 배포

Vercel 에 연결한 뒤 `MONGODB_URI`, `MONGODB_DB` 환경 변수를 설정하면 끝.
