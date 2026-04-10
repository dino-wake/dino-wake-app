# 스타일링 규칙

Gluestack UI v3 + NativeWind 기반 스타일링 규칙.

---

## 색상 토큰

컴포넌트에서 **직접 hex 색상을 사용하지 않는다.** 반드시 Gluestack 색상 토큰을 사용한다.

| 용도 | 토큰 패턴 | 예시 |
|------|-----------|------|
| 배경 | `bg-background-{0~950}` | `bg-background-0`, `bg-background-900` |
| 시맨틱 배경 | `bg-background-{state}` | `bg-background-error`, `bg-background-muted` |
| 텍스트 | `text-typography-{0~950}` | `text-typography-700`, `text-typography-50` |
| 주요 액션 | `bg-primary-{300~700}` | `bg-primary-500` |
| 성공/오류/경고 | `bg-{state}-{shade}` | `bg-error-500`, `bg-success-600` |
| 테두리 | `border-outline-{100~500}` | `border-outline-300` |
| 인디케이터 | `indicator-{state}` | `indicator-error`, `indicator-primary` |

```tsx
// ❌ 금지
<Box style={{ backgroundColor: '#1a1a1a' }} />
<Text style={{ color: '#333333' }} />

// ✅ 올바름
<Box className="bg-background-900" />
<Text className="text-typography-700" />
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
- 비표준 값이 꼭 필요한 경우에만 임의값 사용: `mt-[15px]`

---

## 다크 모드

- Gluestack 색상 토큰은 다크 모드에서 자동으로 전환됨
- 다크 모드 전용 재정의가 필요한 경우 `dark:` prefix 사용

```tsx
// 토큰 사용 시 → 별도 dark: 클래스 불필요
<Box className="bg-background-0" />

// 커스텀 색상이 필요한 경우에만
<Box className="bg-white dark:bg-zinc-900" />
```

---

## 플랫폼별 스타일

| prefix | 적용 대상 |
|--------|-----------|
| `web:` | 웹 전용 (cursor, ring, outline 등) |
| `ios:` | iOS 전용 |
| `android:` | Android 전용 |

```tsx
<Button className="web:cursor-pointer web:ring-2 web:ring-primary-300" />
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
| 직접 hex 색상 사용 | Gluestack 토큰 사용 |
| `margin`으로 자식 간격 조정 | `gap-*` 사용 |
| 임의값 남발 (`mt-[13px]`) | 표준 스케일 우선 사용 |
| `style={{ color: '...' }}` 인라인 색상 | `className="text-*"` 사용 |
