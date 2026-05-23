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
  └─ [알을 쓰다듬기(탭)] → router.replace('/emotion-dial', { alarmId })

무드 선택 (emotion-dial)
  ├─ [다이얼 선택 후 확인] → router.replace('/wake-complete', { mood, alarmId })
  └─ [나중에 기록할래요] → router.back()

기상 완료 (wake-complete)
  └─ [홈으로] → router.replace('/(tabs)')
```

- `alarm-ringing`과 `wake-complete`는 `presentation: 'fullScreenModal'`로 열린다.
- `alarmId`를 각 화면에 params로 전달해 흐름을 추적한다.
- `emotion-dial`은 알람 플로우(alarmId 있음)와 standalone(alarmId 없음)을 모두 지원한다.

---

## alarm-ringing UI

- 알람 메타: 라벨 배지(`#E8F8F0`) + 시간(86px) + 요일
- 알 이미지(`dino_egg.png`)를 중앙 리플 애니메이션 위에 배치, 탭 시 기상 플로우 진입
- 힌트 섹션: `Hand` 아이콘 + "알을 쓰다듬어서 공룡을 깨워요!" 텍스트
- 스누즈: 최대 3회, 5분 간격 (`scheduleSnoozeNotification`)

---

## emotion-dial UI

### 다이얼 동작

- 초기 위치: 상쾌해요(0°, 12시)
- 드래그 or 레이블 탭 → 가장 근처 감정으로 스냅 (햅틱 피드백)
- 아크: **0°(12시)에서 현재 선택 각도까지** 가변 길이 (mint `#B8E8D0`)
- 편안해요(300°) → 상쾌해요 이동 시 target=360 (아크가 완전한 원으로 채워짐)

### SVG 구성

| 요소 | 설명 |
|------|------|
| 배경 링 | 359.9° 도넛, `#E8E8E4` |
| 진행 아크 | `buildVariableArc(angle)`, 0°~angle, `#B8E8D0` |
| 내부 흰 원 | `r = INNER_R - 2` |
| 노브 | `KNOB_R = (OUTER_R + INNER_R) / 2` 위치, Reanimated 스프링 |

### 치수

```
DIAL_SIZE = 340   (dialWrap)
OUTER_R   = 135   (270/2)
INNER_R   = 113   (135 × 0.84)
KNOB_R    = 124   (링 중간선)
```

### 애니메이션

- `useSharedValue(angle)` + `withSpring({ damping: 30, stiffness: 200 })` (임계감쇠, 바운스 없음)
- `useAnimatedProps` → `AnimatedPath.d` (아크 SVG 경로 실시간 업데이트)
- `useAnimatedStyle` → 노브 `left/top` 위치
- PanResponder로 드래그 각도 계산 → `selectEmotionRef.current(nearestIdx)`

---

## 알림 수신 처리 (_layout.tsx)

| 상황 | 처리 |
|------|------|
| 포그라운드 | `addNotificationReceivedListener` → `/alarm-ringing?alarmId=` 로 push |
| 백그라운드/종료 후 탭 | `useLastNotificationResponse` → 동일하게 push |

중복 처리 방지를 위해 `lastResponseRef`로 마지막 처리한 `requestId`를 기억한다.
