# 스타일링 규칙

Gluestack UI v3 + NativeWind 기반 스타일링 규칙.

---

## 색상 토큰

컴포넌트에서 **직접 hex 색상을 사용하지 않는다.** 반드시 Gluestack/Dino 색상 토큰을 사용한다.

### Gluestack 시맨틱 토큰

| 용도 | 토큰 패턴 | 예시 |
|------|-----------|------|
| 카드/표면 배경 | `bg-background-0` | 흰색(라이트) / 다크카드(다크) |
| 앱 배경 | `bg-background-50` | 연회색(라이트) / 다크bg(다크) |
| 시맨틱 배경 | `bg-background-{state}` | `bg-background-error`, `bg-background-muted` |
| 텍스트 | `text-typography-{0~950}` | `text-typography-950`, `text-typography-700` |
| 주요 액션 | `bg-primary-{300~700}` | `bg-primary-500` (accent-green) |
| 성공/오류/경고 | `bg-{state}-{shade}` | `bg-error-500`, `bg-success-600` |
| 테두리 | `border-outline-{100~500}` | `border-outline-300` |

### Dino 커스텀 토큰

Dino 디자인 시스템 전용 토큰. 다크 모드 자동 전환 지원.

| 토큰 | 라이트 | 용도 |
|------|--------|------|
| `bg-dino-bg` | #F5F4F1 | 앱 기본 배경 |
| `bg-dino-card-bg` | #FFFFFF | 카드 배경 |
| `bg-dino-mint` | #B8E8D0 | 민트 강조 배경 |
| `bg-dino-mint-light` | #E8F8F0 | 연한 민트 배경 |
| `bg-dino-accent-green` | #3D8A5A | 주요 녹색 강조 |
| `bg-dino-accent-orange` | #E8A054 | 주요 오렌지 강조 |
| `bg-dino-accent-coral` | #D89575 | 코랄 강조 |
| `border-dino-border` | #E5E4E1 | 기본 테두리 |
| `border-dino-border-strong` | #D1D0CD | 강조 테두리 |
| `text-dino-text-primary` | #1A1918 | 주요 텍스트 |
| `text-dino-text-secondary` | #6D6C6A | 보조 텍스트 |
| `text-dino-text-tertiary` | #9C9B99 | 세번째 텍스트 |
| `text-dino-tab-inactive` | #A8A7A5 | 비활성 탭 텍스트 |

```tsx
// ❌ 금지 — 직접 hex 사용
<Box style={{ backgroundColor: '#F5F4F1' }} />
<Text style={{ color: '#1A1918' }} />

// ✅ 올바름 — dino 토큰 사용
<Box className="bg-dino-bg" />
<Text className="text-dino-text-primary" />

// ✅ 카드 배경 (다크 모드 자동 대응)
<Box className="bg-background-0" />   {/* Gluestack 시맨틱 토큰 */}
<Box className="bg-dino-card-bg" />   {/* Dino 토큰 — 동일 효과 */}
```

---

## 스페이싱

Tailwind 스케일을 일관되게 사용한다. (`1` = 4px)

| 값 | px | 클래스 |
|----|-----|--------|
| 1 | 4px | `p-1`, `gap-1`, `m-1` |
| 2 | 8px | `p-2`, `gap-2` |
| 3 | 12px | `p-3`, `gap-3` |
| 4 | 16px | `p-4`, `gap-4` |
| 6 | 24px | `p-6`, `gap-6` |
| 8 | 32px | `p-8`, `gap-8` |

- flex 컨테이너 내부 자식 간격은 `margin` 대신 `gap-*` 사용
- `HStack`/`VStack`의 `space` prop 우선 사용 (`space="sm"` = `gap-2`)
- 비표준 값이 꼭 필요한 경우에만 임의값 사용: `mt-[15px]`

---

## 다크 모드

- Gluestack 색상 토큰(`background-*`, `typography-*`)과 Dino 토큰(`dino-*`)은 다크 모드에서 자동으로 전환됨
- 다크 모드 전용 재정의가 필요한 경우 `dark:` prefix 사용

```tsx
// ✅ 토큰 사용 시 → 별도 dark: 클래스 불필요
<Box className="bg-background-0" />
<Box className="bg-dino-card-bg" />

// ⚠️ 하드코딩 시 → dark: 직접 처리 필요
<Box className="bg-white dark:bg-zinc-900" />
```

---

## 타이포그래피 스케일 (Dino)

Dino 디자인 시스템 전용 폰트 크기/자간 토큰.

| 토큰 | 크기 | 용도 |
|------|------|------|
| `text-dino-time` | 36px | 시간 표시 |
| `text-dino-title` | 22px | 페이지 제목 |
| `text-dino-section` | 15px | 섹션 제목 |
| `text-dino-body` | 15px | 본문 |
| `text-dino-sub` | 11px | 보조 텍스트 |
| `text-dino-label` | 12px | 섹션 레이블 |
| `text-dino-tab` | 10px | 탭 레이블 |

| 자간 토큰 | 값 | 용도 |
|-----------|-----|------|
| `tracking-dino-time` | -1px | 시간 표시 |
| `tracking-dino-label` | 0.4px | 섹션 레이블 |

---

## 플랫폼별 스타일

| prefix | 적용 대상 |
|--------|-----------|
| `web:` | 웹 전용 (cursor, ring, outline 등) |
| `ios:` | iOS 전용 |
| `android:` | Android 전용 |

```tsx
<Pressable className="web:cursor-pointer web:ring-2 web:ring-primary-300" />
```

---

## 상태 기반 스타일

Gluestack 컴포넌트는 `data-[state]` selector로 상태 스타일을 처리한다.

| 상태 | selector |
|------|----------|
| 비활성화 | `data-[disabled=true]:opacity-40` |
| 호버 | `data-[hover=true]:bg-primary-600` |
| 포커스 | `data-[focus=true]:border-primary-500` |
| 포커스 가시 | `data-[focus-visible=true]:ring-2` |
| 체크됨 | `data-[checked=true]:bg-primary-500` |
| 유효하지 않음 | `data-[invalid=true]:border-error-500` |

```tsx
<Input className="data-[invalid=true]:border-error-500 data-[focus=true]:border-primary-500" />
```

---

## 반응형

```tsx
<Box className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4" />
```

---

## 금지 사항

| 금지 | 대안 |
|------|------|
| 직접 hex 색상 사용 | Gluestack/Dino 토큰 사용 |
| `margin`으로 자식 간격 조정 | `gap-*` 또는 `space` prop 사용 |
| 임의값 남발 (`mt-[13px]`) | 표준 스케일 우선 사용 |
| `style={{ color: '...' }}` 인라인 색상 | `className="text-*"` 사용 |
| `View`, `Text` from `react-native` | `Box`, `Text` from Gluestack UI 사용 |
