# HTTP 요청 규칙 (React Query)

## 디렉터리 구조

```
hooks/
  queries/          # useQuery 기반 GET 요청
    use-[resource].ts
  mutations/        # useMutation 기반 POST/PUT/DELETE 요청
    use-[action]-[resource].ts
lib/
  api/
    [resource].ts   # 순수 fetch 함수 (React 의존성 없음)
```

---

## Query Key 규칙

query key는 배열 형태로 계층 구조를 따른다.

```ts
// 패턴: [도메인, 액션?, 식별자?]
["alarms"]                    // 목록
["alarms", "detail", id]      // 단건
["alarms", "history", userId] // 파생 목록
```

query key를 상수로 관리해 오타와 중복을 방지한다.

```ts
// lib/api/alarm.ts
export const alarmKeys = {
  all: ["alarms"] as const,
  detail: (id: string) => ["alarms", "detail", id] as const,
  history: (userId: string) => ["alarms", "history", userId] as const,
};
```

---

## fetch 함수 (lib/api/)

- 순수 함수: React 훅, 전역 상태 의존 금지
- 성공 시 데이터 반환, 실패 시 `Error` throw
- 응답 타입을 명시적으로 지정

```ts
// lib/api/alarm.ts
import type { Alarm } from "@/types/alarm";

export async function fetchAlarms(): Promise<Alarm[]> {
  const res = await fetch("/api/alarms");
  if (!res.ok) throw new Error("알람 목록 조회 실패");
  return res.json();
}

export async function fetchAlarm(id: string): Promise<Alarm> {
  const res = await fetch(`/api/alarms/${id}`);
  if (!res.ok) throw new Error("알람 조회 실패");
  return res.json();
}

export async function createAlarm(body: CreateAlarmBody): Promise<Alarm> {
  const res = await fetch("/api/alarms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("알람 생성 실패");
  return res.json();
}
```

---

## Query 훅 (hooks/queries/)

- 파일명: `use-[resource].ts`
- query key, fetch 함수, staleTime 등 설정을 훅 내부에 캡슐화
- 컴포넌트에 직접 `useQuery`를 쓰지 않는다

```ts
// hooks/queries/use-alarms.ts
import { useQuery } from "@tanstack/react-query";
import { fetchAlarms, alarmKeys } from "@/lib/api/alarm";

export function useAlarms() {
  return useQuery({
    queryKey: alarmKeys.all,
    queryFn: fetchAlarms,
  });
}
```

```ts
// hooks/queries/use-alarm.ts
import { useQuery } from "@tanstack/react-query";
import { fetchAlarm, alarmKeys } from "@/lib/api/alarm";

export function useAlarm(id: string) {
  return useQuery({
    queryKey: alarmKeys.detail(id),
    queryFn: () => fetchAlarm(id),
    enabled: !!id,
  });
}
```

---

## Mutation 훅 (hooks/mutations/)

- 파일명: `use-[action]-[resource].ts`
- 성공 시 연관 query를 invalidate해 자동 동기화
- `onSuccess` / `onError` 콜백은 훅 호출 시 주입받아 컴포넌트에서 처리

```ts
// hooks/mutations/use-create-alarm.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAlarm, alarmKeys } from "@/lib/api/alarm";
import type { CreateAlarmBody } from "@/types/alarm";

export function useCreateAlarm() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateAlarmBody) => createAlarm(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: alarmKeys.all });
    },
  });
}
```

컴포넌트 사용 예시:

```tsx
const { mutate: createAlarm, isPending } = useCreateAlarm();

createAlarm(
  { time: "07:00", label: "기상" },
  {
    onSuccess: () => router.back(),
    onError: (err) => Alert.alert("오류", err.message),
  }
);
```

---

## 금지 사항

| 금지 | 이유 |
|------|------|
| 컴포넌트에서 `useQuery` / `useMutation` 직접 사용 | query key 분산, 재사용 불가 |
| fetch 함수 내 `console.log` 남기기 | 민감 정보 노출 위험 |
| `queryKey`에 인라인 배열 리터럴 사용 | 오타 및 불일치 발생 |
| mutation 후 `invalidateQueries` 누락 | UI와 서버 상태 불일치 |
| `any` 타입 사용 | strict TypeScript 위반 |

---

## staleTime 가이드

| 데이터 특성 | staleTime |
|------------|-----------|
| 실시간성 높음 (알람 목록 등) | `0` (기본값) |
| 준정적 (사용자 설정 등) | `1000 * 60` (1분) |
| 정적 (공지, 버전 등) | `1000 * 60 * 10` (10분) |

`QueryClient` 기본값(`lib/query-client.ts`)은 1분으로 설정되어 있으며, 훅별로 override 가능하다.
