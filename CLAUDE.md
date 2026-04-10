# Dino Wake App — CLAUDE.md

## 프로젝트 개요

공룡 테마의 알람/기상 앱. **Expo + React Native** 기반 크로스플랫폼 앱 (iOS, Android, Web).

## 기술 스택

- **Runtime**: Expo 55, React Native 0.83, React 19
- **언어**: TypeScript (strict)
- **라우팅**: Expo Router (파일 기반, Next.js 방식)
- **애니메이션**: React Native Reanimated 4
- **패키지 매니저**: pnpm

## 프로젝트 구조

```
app/              # 파일 기반 라우팅 (Expo Router)
  _layout.tsx     # 루트 레이아웃
  (tabs)/         # 탭 네비게이션 그룹
components/       # 재사용 UI 컴포넌트
  ui/             # 원자적 UI 컴포넌트
hooks/            # 커스텀 훅
constants/
  theme.ts        # Colors, Fonts 상수
```

## Git 규칙

- **커밋은 반드시 사용자의 확인을 받은 후에 실행한다.**

## 개발 규칙

### 스타일링
- 테마 색상은 `constants/theme.ts`의 `Colors` 사용
- 컴포넌트에서 직접 색상 하드코딩 금지 → `useThemeColor` 훅 사용
- 플랫폼별 스타일은 `Platform.select()` 사용

### 크로스플랫폼
- iOS 전용 구현: `.ios.tsx` 확장자
- 웹 전용 구현: `.web.tsx` 확장자
- 아이콘: `components/ui/icon-symbol.tsx` (iOS: SF Symbols, 기타: Material Icons)

### 컴포넌트
- 테마 적용 텍스트: `ThemedText` 사용
- 테마 적용 뷰: `ThemedView` 사용
- 로직은 커스텀 훅으로 분리 (SRP 준수)

### 애니메이션
- 성능이 중요한 애니메이션은 **React Native Reanimated** 사용
- JS 스레드 애니메이션 지양 → `useSharedValue`, `useAnimatedStyle` 활용

## 문서 목차

### 디자인
| 문서 | 경로 | 설명 |
|------|------|------|
| 스타일링 규칙 | [docs/design-docs/styling.md](docs/design-docs/styling.md) | 색상 토큰, 스페이싱, 다크 모드, 플랫폼별 스타일 |
| 레이아웃 규칙 | [docs/design-docs/layout.md](docs/design-docs/layout.md) | Box/HStack/VStack/Grid 사용법, 컴포넌트 구성 패턴, 타이포그래피 |
| 폼 컴포넌트 규칙 | [docs/design-docs/forms.md](docs/design-docs/forms.md) | FormControl 래핑, Input/Checkbox/Radio/Switch/Slider 사용법 |
| 오버레이 규칙 | [docs/design-docs/overlays.md](docs/design-docs/overlays.md) | Modal/AlertDialog/Actionsheet/Drawer/Popover/Tooltip 선택 기준 및 사용법 |

### 엔지니어링
| 문서 | 경로 | 설명 |
|------|------|------|
| HTTP 요청 규칙 | [docs/hooks/request-http.md](docs/hooks/request-http.md) | React Query를 통한 fetch 함수, query/mutation 훅 작성 규칙 |

### 기획
| 문서 | 경로 | 설명 |
|------|------|------|
| 핵심 PRD | [docs/plans/PRD_CORE.md](docs/plans/PRD_CORE.md) | 핵심 기능 제품 요구사항 정의서 |

## 실행 명령어

```bash
pnpm start          # 개발 서버
pnpm ios            # iOS 시뮬레이터
pnpm android        # Android 에뮬레이터
pnpm web            # 웹 브라우저
pnpm lint           # ESLint
```

## gstack (recommended)

This project uses [gstack](https://github.com/garrytan/gstack) for AI-assisted workflows.
Install it for the best experience:

```bash
git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup --team
```

Skills like /qa, /ship, /review, /investigate, and /browse become available after install.
Use /browse for all web browsing. Use ~/.claude/skills/gstack/... for gstack file paths.
