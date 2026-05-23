# 알람 구현 규칙

## 개요

알람은 세 레이어로 분리된다.

```
lib/db/alarms.ts       ← SQLite CRUD (순수 함수, 부작용 없음)
lib/notifications.ts   ← expo-notifications 스케줄링
hooks/use-alarms.ts    ← 두 레이어를 조합한 React 훅
```

컴포넌트는 반드시 `useAlarms` 훅만 사용한다. `AlarmDb.*`나 `AlarmScheduler.*`를 직접 호출하지 않는다.

---

## SQLite 스키마

```sql
CREATE TABLE IF NOT EXISTS alarms (
  id               TEXT    PRIMARY KEY,
  hour             INTEGER NOT NULL,
  minute           INTEGER NOT NULL,
  label            TEXT    NOT NULL,
  memo             TEXT    NOT NULL DEFAULT '',
  days             TEXT    NOT NULL DEFAULT '[]',      -- JSON: number[]
  enabled          INTEGER NOT NULL DEFAULT 1,         -- 0 | 1
  sound            INTEGER NOT NULL DEFAULT 1,
  snooze           INTEGER NOT NULL DEFAULT 0,
  notification_ids TEXT    NOT NULL DEFAULT '[]'       -- JSON: string[]
);
```

- `days`: `0=월, 1=화, 2=수, 3=목, 4=금, 5=토, 6=일`
- `notification_ids`: 각 요일마다 별도의 expo 알림 ID가 저장됨 (요일 반복 알람 = 최대 7개 ID)

---

## 알림 스케줄링

### 요일 매핑

앱의 요일 인덱스(0=월)와 expo-notifications의 weekday(1=일)가 다르다.

| 앱 days | 요일 | expo weekday |
|---------|------|-------------|
| 0 | 월 | 2 |
| 1 | 화 | 3 |
| 2 | 수 | 4 |
| 3 | 목 | 5 |
| 4 | 금 | 6 |
| 5 | 토 | 7 |
| 6 | 일 | 1 |

### 스케줄 정책

| days 설정 | 트리거 타입 | 비고 |
|-----------|-------------|------|
| `[]` (반복 없음) | `DATE` | 다음 해당 시각에 1회 발송 |
| 1개 이상 | `WEEKLY` × N | 각 요일마다 개별 스케줄 |

### 알람 토글 시 동작

```
enable  → scheduleAlarmNotifications → notification_ids 저장
disable → cancelAlarmNotifications → notification_ids = []
```

알람을 수정할 때는 **기존 notification_ids를 먼저 취소**하고 새로 스케줄한다.

---

## Expo Go 제한

`expo-notifications`는 네이티브 모듈이므로 **Expo Go에서는 동작하지 않는다**.  
반드시 `expo-dev-client` 빌드 또는 EAS 빌드로 테스트한다.

```bash
pnpm ios        # dev client 빌드 필요
pnpm android    # dev client 빌드 필요
```

---

## 기상 플로우

```
알람 울림 (alarm-ringing)
  ├─ [5분 더] → scheduleSnoozeNotification → router.back()  (최대 3회)
  └─ [기상 미션 시작] → router.replace('/emotion-dial', { alarmId })

무드 선택 (emotion-dial)
  └─ [기상 완료] → router.replace('/wake-complete', { mood, alarmId })

기상 완료 (wake-complete)
  └─ [홈으로] → router.replace('/(tabs)')
```

- `alarm-ringing`과 `wake-complete`는 `presentation: 'fullScreenModal'`로 열린다.
- `alarmId`를 각 화면에 params로 전달해 흐름을 추적한다.
- `emotion-dial`은 알람 플로우(alarmId 있음)와 standalone(alarmId 없음)을 모두 지원한다.

---

## 알림 수신 처리 (_layout.tsx)

| 상황 | 처리 |
|------|------|
| 포그라운드 | `addNotificationReceivedListener` → `/alarm-ringing?alarmId=` 로 push |
| 백그라운드/종료 후 탭 | `useLastNotificationResponse` → 동일하게 push |

중복 처리 방지를 위해 `lastResponseRef`로 마지막 처리한 `requestId`를 기억한다.
