# 알람 Full-Screen 구현 계획

## 구현 상태 요약

| 상황 | 동작 | 상태 |
|------|------|------|
| 잠금화면 | 화면 켜지며 알람 화면 표시 | ✅ 완료 |
| 앱 포그라운드 | 즉시 알람 화면 전환 | ✅ 완료 |
| 앱 백그라운드/종료 | Full-Screen Intent → 알람 화면 | ✅ 완료 |
| 다른 앱 사용 중 | 배너 알림만 표시 (OS 제약) | ❌ 미해결 — [ISSUE-001](../engineering/issues.md) 참고 |

---

## 목표

현재 notification 배너 방식에서 벗어나, 실제 알람 앱처럼 동작하도록 개선한다.

- 잠금화면에서 화면이 켜지며 알람 화면 오버레이
- 백그라운드 상태에서도 자동으로 전체화면 전환
- 알람음 루프 재생 + 연속 진동

---

## 현재 vs 목표

| 상황 | 현재 동작 | 목표 동작 |
|------|-----------|-----------|
| 앱 포그라운드 | 즉시 알람 화면 전환 + 알람음 + 진동 | ✅ 달성 |
| 앱 백그라운드/종료 | Full-Screen Intent → 자동 알람 화면 | ✅ 달성 |
| 잠금화면 | 화면 켜지며 알람 화면 오버레이 | ✅ 달성 |
| 다른 앱 사용 중 | 배너 알림 (OS 차단) | ❌ OS 제약으로 미달성 |

---

## 기술 분석

### Android

| 기능 | 구현 방법 | 필요 조건 |
|------|-----------|-----------|
| 잠금화면 자동 전환 | Full-Screen Intent | `USE_FULL_SCREEN_INTENT` 권한 |
| 화면 켜기 | `WAKE_LOCK` flag | `WAKE_LOCK` 권한 |
| 키가드(잠금) 해제 | `DISABLE_KEYGUARD` flag | `DISABLE_KEYGUARD` 권한 |
| 알람음 루프 재생 | `expo-audio` | 앱 내 사운드 파일 |
| 연속 진동 | RN `Vibration` (내장) | 추가 설치 불필요 |

**expo-notifications 한계**  
JS API에서 `fullScreenIntent` 미지원 → `@notifee/app`으로 대체 필요

### iOS

Full-screen alert은 VoIP(PushKit) 또는 CallKit 수준의 Apple 특별 권한 필요.  
일반 앱은 App Store 심사 없이 불가.

**MVP 범위**: iOS는 알림 탭 → 화면 진입 방식 유지. 알람음·진동은 앱 포그라운드 상태에서만 처리.

---

## 구현 단계

### 1단계: 알람음 + 진동 ✅ 완료

**범위**: 앱이 포그라운드일 때 알람 화면 진입 시 사운드·진동 시작

**작업**

1. `expo-audio` 설치
   ```bash
   pnpm add expo-audio
   ```

2. 알람 사운드 파일 추가
   - 위치: `assets/sounds/alarm.mp3`
   - 루프 재생용 짧은 클립 (2~5초 루프)

3. `app/alarm-ringing.tsx` 수정
   - 마운트 시 `expo-audio`로 사운드 루프 재생 시작
   - `Vibration.vibrate([0, 500, 300, 500], true)` 연속 진동
   - 스누즈·해제 시 `Vibration.cancel()` + 오디오 언로드

4. `lib/notifications.ts` 알림 채널 강화
   - `importance: MAX`
   - `vibrationPattern: [0, 500, 300, 500]`
   - `sound`: 커스텀 사운드 파일 지정

**결과**: 포그라운드 상태에서 완전한 알람 경험 제공

---

### 2단계: Android Full-Screen Intent ✅ 완료

**범위**: 백그라운드·잠금화면에서도 자동으로 알람 화면 표시

**작업**

1. `app.json` Android 권한 추가
   ```json
   {
     "android": {
       "permissions": [
         "USE_FULL_SCREEN_INTENT",
         "WAKE_LOCK",
         "RECEIVE_BOOT_COMPLETED"
       ]
     }
   }
   ```

2. `@notifee/app` 설치
   ```bash
   pnpm add @notifee/app
   ```
   - expo-notifications는 iOS + 스누즈 알림용으로 유지
   - Android 알람 발송은 notifee로 처리

3. `lib/notifications.ts` 분기 처리
   ```
   Android → notifee (fullScreenIntent 지원)
   iOS     → expo-notifications (기존 유지)
   ```

4. notifee 알림 설정
   ```typescript
   await notifee.displayNotification({
     title: alarm.label,
     android: {
       channelId: 'alarms',
       category: AndroidCategory.ALARM,
       importance: AndroidImportance.HIGH,
       fullScreenAction: { id: 'default' },  // ← Full-Screen Intent
       pressAction: { id: 'default' },
     },
   });
   ```

5. Android Headless Task 등록
   - 앱이 완전히 종료된 상태에서 알림 수신 시 JS 코드 실행
   - `alarm-ringing` 화면으로 네비게이션

6. 화면 켜기 처리 (`alarm-ringing.tsx`)
   ```typescript
   import { activateKeepAwake } from 'expo-keep-awake';
   // 또는 Platform.OS === 'android'일 때 native module 호출
   ```

**결과**: 잠금화면·백그라운드에서도 알람 화면 자동 표시

---

### 3단계: 키가드 해제 (선택) ✅ 완료

`showWhenLocked`, `turnScreenOn` 속성을 `withAndroidAlarmConfig` config plugin으로 MainActivity에 추가. 별도 네이티브 모듈 없이 처리됨.

---

### 4단계: 다른 앱 사용 중 오버레이 (미구현)

**범위**: 화면 켜짐 + 다른 앱 포그라운드 상태에서 알람 화면 강제 표시

Android OS가 이 상황에서 `fullScreenIntent`를 차단하므로 별도 메커니즘 필요. 상세 내용은 [ISSUE-001](../engineering/issues.md) 참고.

---

### (구) 3단계: 키가드 해제 원안 (선택)

화면이 켜질 때 잠금 화면을 자동으로 우회 (PIN/패턴 없이 알람 화면 표시).

- Android `WindowManager` 플래그: `FLAG_DISMISS_KEYGUARD`, `FLAG_SHOW_WHEN_LOCKED`
- Native Module 작성 필요 (Expo Plugin 또는 직접 구현)
- 보안 정책상 민감 → 선택적 구현

---

## 의존성 변화

| 패키지 | 용도 | 단계 |
|--------|------|------|
| `expo-audio` | 알람음 루프 재생 | 1단계 |
| `@notifee/app` | Android Full-Screen Intent | 2단계 |
| `expo-keep-awake` | 알람 중 화면 유지 | 2단계 |
| `expo-notifications` | iOS 알림 + 스누즈 (유지) | 현재 |

---

## 플랫폼별 최종 동작

| 기능 | Android | iOS |
|------|---------|-----|
| 알람음 루프 | ✅ 1단계 | ✅ 1단계 (포그라운드) |
| 연속 진동 | ✅ 1단계 | ✅ 1단계 (포그라운드) |
| 백그라운드 자동 전환 | ✅ 2단계 | ❌ 시스템 제약 |
| 잠금화면 오버레이 | ✅ 2단계 | ❌ 시스템 제약 |
| 키가드 해제 | ⚙️ 3단계 (선택) | ❌ 불가 |

---

## 참고

- [notifee Full-Screen Intent 문서](https://notifee.app/react-native/docs/android/fullscreen)
- [Android USE_FULL_SCREEN_INTENT 권한](https://developer.android.com/reference/android/Manifest.permission#USE_FULL_SCREEN_INTENT)
- [expo-audio 문서](https://docs.expo.dev/versions/latest/sdk/audio/)
