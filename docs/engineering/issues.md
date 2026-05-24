# 알려진 이슈 및 미해결 과제

---

## [ISSUE-001] 다른 앱 사용 중 알람 전체화면 표시 불가

**상태:** 미해결 (Android 플랫폼 제약)

### 현상

알람 시간이 됐을 때:
- 화면 꺼짐 / 잠금화면 → 알람 화면이 전체화면으로 정상 표시 ✅
- 다른 앱 사용 중 (화면 켜짐) → 배너 알림만 표시, 앱이 자동으로 열리지 않음 ❌

### 원인

Android는 `fullScreenIntent` / notifee `fullScreenAction`을 사용하더라도, 화면이 켜진 상태에서 다른 앱이 포그라운드에 있으면 전체화면 인텐트를 의도적으로 차단한다. 이는 Android OS 설계 동작이며 알람 앱이어도 예외 없다.

참고: [Android Developers — Full-screen intents](https://developer.android.com/develop/ui/views/notifications/time-sensitive), [AOSP FSI Limits](https://source.android.com/docs/core/permissions/fsi-limits)

### 해결 방법 (미구현)

다른 앱 위에 알람 화면을 강제로 띄우려면 `SYSTEM_ALERT_WINDOW` (`TYPE_APPLICATION_OVERLAY`) 방식을 사용해야 한다.

**구현에 필요한 작업:**
1. Expo bare workflow 전환 (또는 config plugin으로 native 코드 추가)
2. 커스텀 Android `BroadcastReceiver` 구현 — 알람 시간에 `WindowManager`로 오버레이 윈도우 표시
3. `SYSTEM_ALERT_WINDOW` 권한 manifest 선언
4. 앱 최초 실행 시 "다른 앱 위에 표시" 권한 요청 흐름 추가
5. 설정 탭에 권한 바로가기 추가

**사용자 경험:**
- 사용자가 "다른 앱 위에 표시" 권한을 반드시 수동으로 허용해야 함
- 미허용 시 현재와 동일하게 배너 알림으로 폴백

### 현재 동작 (임시 방침)

배너 알림 표시 후 사용자가 탭하면 알람 화면으로 이동. 대부분의 서드파티 알람 앱과 동일한 방식으로 유지.
