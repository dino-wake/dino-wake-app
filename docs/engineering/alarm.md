# 알람 구현 규칙

## 개요

알람은 세 레이어로 분리된다.

```
lib/db/alarms.ts            ← SQLite CRUD (순수 함수, 부작용 없음)
lib/db/wake-logs.ts         ← 기상 로그 CRUD
lib/db/daily-memo.ts        ← 준비물/일정 메모 단일 레코드 CRUD
lib/db/briefing-settings.ts ← 브리핑 설정 단일 레코드 CRUD
lib/notifications.ts        ← 알림 스케줄링 (Android: notifee, iOS: expo-notifications)
hooks/use-alarms.ts         ← 두 레이어를 조합한 React 훅
```

컴포넌트는 반드시 `useAlarms` 훅만 사용한다. `AlarmDb.*`나 `AlarmScheduler.*`를 직접 호출하지 않는다.

---

## SQLite 스키마

모든 테이블은 `initAlarmDb()` 한 번으로 생성된다 (`lib/db/alarms.ts`).

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

CREATE TABLE IF NOT EXISTS wake_logs (
  id            TEXT    PRIMARY KEY,
  alarm_id      TEXT    NOT NULL DEFAULT '',
  woken_at      INTEGER NOT NULL,           -- Unix ms (Date.now())
  alarm_hour    INTEGER NOT NULL,
  alarm_minute  INTEGER NOT NULL,
  emotion_level INTEGER NOT NULL            -- 0~5 (졸려요=0 ~ 상쾌해요=5)
);

CREATE TABLE IF NOT EXISTS daily_memo (
  id         INTEGER PRIMARY KEY DEFAULT 1, -- 단일 레코드
  content    TEXT    NOT NULL DEFAULT '',
  updated_at INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS briefing_settings (
  id            INTEGER PRIMARY KEY DEFAULT 1, -- 단일 레코드
  narration     INTEGER NOT NULL DEFAULT 0,
  weather       INTEGER NOT NULL DEFAULT 1,
  fortune_zodiac INTEGER NOT NULL DEFAULT 0,
  fortune_star  INTEGER NOT NULL DEFAULT 0,
  news          INTEGER NOT NULL DEFAULT 1
);
```

- `days`: `0=월, 1=화, 2=수, 3=목, 4=금, 5=토, 6=일`
- `notification_ids`: 각 요일마다 별도의 알림 ID (요일 반복 알람 = 최대 7개 ID)
- `daily_memo`, `briefing_settings`: id=1 고정, `INSERT ... ON CONFLICT(id) DO UPDATE` 패턴으로 upsert

### 감정 레벨 매핑

| 레벨 | 감정 |
|------|------|
| 0 | 졸려요 |
| 1 | 피곤해요 |
| 2 | 불안해요 |
| 3 | 편안해요 |
| 4 | 설레요 |
| 5 | 상쾌해요 |

---

## 알림 스케줄링

### 플랫폼 분기

| 플랫폼 | 라이브러리 | 비고 |
|--------|-----------|------|
| Android | `@notifee/react-native` | Full-Screen Intent 지원, `alarmManager: { allowWhileIdle: true }`, 4주치 트리거 스케줄 |
| iOS | `expo-notifications` | 기존 방식 유지 |

Android는 `index.js`에서 `notifee.onBackgroundEvent()` 등록 필요 (앱 엔트리포인트).  
`android/build.gradle`에 notifee 로컬 Maven 리포지토리 등록 필수:
```groovy
maven { url "$rootDir/../node_modules/@notifee/react-native/android/libs" }
```

`vibrationPattern`은 **모두 양수값**이어야 함 (0 포함 시 notifee 크래시): `[100, 500, 100, 500]`

### Android 알림 채널

채널 ID: `alarms-v2` (상수 `ALARM_CHANNEL_ID`로 관리)

Android는 채널 설정을 한 번 생성하면 캐싱한다. `bypassDnd`, `importance` 등 설정을 변경할 때는 채널 ID를 새 버전으로 올려야 반영된다.

### Android 권한 구성

`app.json` `android.permissions`에 선언, `plugins/withAndroidAlarmConfig.js`로 추가 설정 주입:

| 권한 | 용도 |
|------|------|
| `USE_FULL_SCREEN_INTENT` | 잠금화면에서 알람 화면 표시 |
| `WAKE_LOCK` | 화면 켜기 유지 |
| `SCHEDULE_EXACT_ALARM` | 정확한 시간에 알람 트리거 |
| `USE_EXACT_ALARM` | 정확한 알람 (시스템 레벨) |
| `VIBRATE` | 진동 |
| `RECEIVE_BOOT_COMPLETED` | 기기 재부팅 후 알람 복구 |

`withAndroidAlarmConfig.js` 플러그인이 prebuild 시 `AndroidManifest.xml`에 자동 추가:
- `android:showWhenLocked="true"` — 잠금화면 위에 액티비티 표시
- `android:turnScreenOn="true"` — 알람 시 화면 자동 켜기
- `SET_ALARM` intent-filter — OS가 이 앱을 알람 앱으로 인식 (`USE_FULL_SCREEN_INTENT` 자동 부여 조건)

> **pnpm 주의**: `plugins/` 내 커스텀 플러그인에서 `@expo/config-plugins`를 require할 때 pnpm strict 모드로 인해 직접 require가 실패할 수 있다. expo를 통해 resolve해야 한다:
> ```js
> const { withAndroidManifest } = require(
>   require.resolve('@expo/config-plugins', { paths: [require.resolve('expo')] }),
> );
> ```

### Android 런타임 권한 요청

`lib/notifications.ts`에서 export하는 함수:

| 함수 | 용도 |
|------|------|
| `requestNotificationPermission()` | 앱 시작 시 POST_NOTIFICATIONS + SCHEDULE_EXACT_ALARM 요청 |
| `requestExactAlarmPermission()` | SCHEDULE_EXACT_ALARM 미허용 시 설정화면으로 이동 |
| `openFullScreenIntentSettings()` | Android 14+ USE_FULL_SCREEN_INTENT 설정화면으로 이동 |

설정 탭에 `requestExactAlarmPermission`, `openFullScreenIntentSettings` 바로가기 버튼이 있다.

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

`expo-notifications` 및 `@notifee/react-native`는 네이티브 모듈이므로 **Expo Go에서는 동작하지 않는다**.  
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
  └─ [알을 5회 스와이프] → router.replace('/emotion-dial', { alarmId })

무드 선택 (emotion-dial)
  ├─ [다이얼 조작 후 "기분을 기록하고 일어나기"] → insertWakeLog() → router.replace('/wake-complete', { mood, alarmId })
  └─ [나중에 기록할래요] → router.replace('/wake-complete', { mood: '', alarmId }) 또는 router.back()

기상 완료 (wake-complete)
  └─ [홈으로] → router.replace('/(tabs)')
```

- `alarm-ringing`과 `wake-complete`는 `presentation: 'fullScreenModal'`로 열린다.
- `alarmId`를 각 화면에 params로 전달해 흐름을 추적한다.
- `emotion-dial`은 알람 플로우(alarmId 있음)와 standalone(alarmId 없음)을 모두 지원한다.

---

## alarm-ringing UI

- 알람 메타: 라벨 배지(`#E8F8F0`) + 시간(86px) + 요일
- 알 이미지(`dino_egg.png`) — 스와이프 5회 완료 시 기상 플로우 진입
- **스와이프 메커니즘**: 좌우 스와이프 1회(임계값 40px)마다 오뚜기 애니메이션 재생, 애니메이션 중 추가 스와이프 차단
  - 애니메이션: `0° → ±20° → ∓12° → ±5° → 0°` (withSequence, 각 스텝 110ms)
  - 피벗: `translateY(+halfH) → rotate → translateY(-halfH)` 패턴 (transformOrigin 미지원 우회)
- `SwipeDots`: 5개 도트, 완료된 것은 초록 필로 표시
- 사운드: `expo-audio useAudioPlayer`, `player.loop = true`
- 진동: `Vibration.vibrate([100, 500, 100, 500], true)`
- 화면 유지: `activateKeepAwakeAsync()` / `deactivateKeepAwake()`
- 스누즈: 최대 3회, 5분 간격 (`scheduleSnoozeNotification`)

---

## emotion-dial UI

### 다이얼 동작

- 초기 상태: 미선택(`selectedIdx = -1`), 감정 텍스트 불표시, 저장 버튼 비활성
- 다이얼을 **한 번이라도 조작**해야 (`hasMoved = true`) 감정 텍스트 표시 및 저장 버튼 활성화
- 드래그 or 레이블 탭 → 가장 근처 감정으로 스냅 (햅틱 피드백)
- 아크: **0°(12시)에서 현재 선택 각도까지** 가변 길이 (mint `#B8E8D0`)
- 편안해요(300°) → 상쾌해요 이동 시 target=360 (아크가 완전한 원으로 채워짐)
- **상쾌해요는 360° 완주(target=360) 후에만 선택 가능** (단순 탭으로는 선택되지만 angle=0이어서 아크가 없음 — 사실상 완주 유도)

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

### iOS (expo-notifications)

| 상황 | 처리 |
|------|------|
| 포그라운드 | `addNotificationReceivedListener` → `/alarm-ringing?alarmId=` 로 push |
| 백그라운드/종료 후 탭 | `useLastNotificationResponse` → 동일하게 push |

중복 처리 방지를 위해 `lastResponseRef`로 마지막 처리한 `requestId`를 기억한다.

### Android (notifee)

| 상황 | 처리 |
|------|------|
| 포그라운드 | `notifee.onForegroundEvent({ type: DELIVERED \| PRESS })` → `/alarm-ringing?alarmId=` 로 push |
| 앱 종료 후 Full-Screen Intent | `notifee.getInitialNotification()` → state 저장 → 네비게이션 준비 후 push |
| 백그라운드 | `notifee.onBackgroundEvent()` — `index.js` 최상단에 등록 (빈 핸들러) |

모든 notifee 코드는 `Platform.OS === 'android'` 가드로 감싼다.

**getInitialNotification 타이밍 주의**: `fullScreenAction`으로 앱이 실행될 때 `getInitialNotification()`은 컴포넌트 mount 즉시 호출되지만, `fontsLoaded === false`이면 Stack이 아직 렌더링되지 않아 `router.push`가 무시된다. 이를 방지하기 위해 alarmId를 `pendingAlarmId` state에 저장하고, `fontsLoaded && pendingAlarmId` 조건이 충족될 때 navigate한다.
