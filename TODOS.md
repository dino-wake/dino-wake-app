# DinoWake — TODOS

> 이 파일은 /plan-ceo-review 결과로 생성됨 (2026-04-10)
> 우선순위: P1 (출시 블로커), P2 (중요), P3 (nice-to-have)

---

## UI 구현 체크리스트 (design/dino-alarm.pen 기반)

### 1단계: 핵심 탭 화면

- [ ] **Alarm Screen 고도화** (`VzDkt`) — `app/(tabs)/index.tsx` (+ 버튼 → Add Modal 연결, 카드 탭 → Edit Modal)
- [ ] **Add Alarm Modal** (`h4RP1`) — `components/alarm/add-alarm-modal.tsx` 신규
- [ ] **Edit Alarm Modal** (`lMGZx`) — `components/alarm/edit-alarm-modal.tsx` 신규
- [ ] **Briefing Page** (`aH9PI`) — `app/(tabs)/briefing.tsx` 구현
- [ ] **Store Page** (`MbG4X`) — `app/(tabs)/store.tsx` 구현
- [ ] **Settings Page** (`poRG8`) — `app/(tabs)/settings.tsx` 구현

### 2단계: 알람 플로우

- [ ] **Alarm Ringing Page** (`dqNtV`) — `app/alarm-ringing.tsx` 신규
- [ ] **Snooze Alert** (`XcapE`) — `components/alarm/snooze-alert.tsx` 신규
- [ ] **Permission Alert** (`cNgW5`) — `components/alarm/permission-alert.tsx` 신규

### 3단계: 인증 플로우

- [ ] **Login Page** (`BAusd`) — `app/auth/login.tsx` 신규
- [ ] **Signup Page** (`nbNEO`) — `app/auth/signup.tsx` 신규
- [ ] **Forgot Password Page** (`EZzAa`) — `app/auth/forgot-password.tsx` 신규
- [ ] **Reset Password Page** (`c1TAk`) — `app/auth/reset-password.tsx` 신규

### 4단계: 설정 하위 페이지

- [ ] **My Page** (`nozTN`) — `app/my-page.tsx` 신규
- [ ] **Dino Name Alert** (`vBrW4`) — `components/settings/dino-name-alert.tsx` 신규
- [ ] **Dino Skin Page** (`7xtnn`) — `app/dino-skin.tsx` 신규
- [ ] **Terms Page** (`7p9L7`) — `app/terms.tsx` 신규
- [ ] **Privacy Page** (`zLihR`) — `app/privacy.tsx` 신규
- [ ] **App Version Page** (`7VGyy`) — `app/app-version.tsx` 신규

### 5단계: 브리핑 하위 페이지

- [ ] **Weather Detail Page** (`gMZB6`) — `app/weather-detail.tsx` 신규
- [ ] **Emotion Dial Page** (`ysqIR`) — `app/emotion-dial.tsx` 신규
- [ ] **Briefing Items Alert** (`U4H5e`) — `components/settings/briefing-items-alert.tsx` 신규

### 6단계: 스토어 하위 페이지

- [ ] **Point History Page** (`4Lpk4`) — `app/point-history.tsx` 신규

---

## P1 — 출시 전 필수 (기술)

### TODO-001: 알람 신뢰성 기술 스펙서
**무엇**: iOS BGTaskScheduler + Android AlarmManager 네이티브 알람 API 방식, 배터리 최적화 예외 요청 UX 설계, expo-notifications 한계 검증  
**왜**: 알람 미울림은 1일 차 DAU 이탈 원인 1위. 이게 없으면 나머지 26개 화면이 의미 없음  
**어디서 시작**: `app/(tabs)/index.tsx` 알람 목록부터 — 실제 스케줄링 로직이 들어갈 위치  
**Effort**: M (인간팀: 3-5일 / CC+gstack: 2-3시간)  
**의존성**: TODO-003 백엔드 스택 결정 후

### TODO-002: LLM 파이프라인 프로토타입 + 비용 검증
**무엇**: 뉴스 10개로 Claude Haiku 퀴즈 생성 비용 측정, 공유 캐시(카테고리당 1회) vs 사용자별 생성 ROI 비교, TTS 음성 포맷(ElevenLabs? Google? Apple?) 결정  
**왜**: DAU 1만 명에서 캐시 없으면 월 LLM 비용 최대 $1,500. 캐시 적용 시 $50 수준으로 절감 가능  
**어디서 시작**: 별도 스크립트로 프로토타입 — 앱 코드 건드리지 말 것  
**Effort**: S (인간팀: 1일 / CC+gstack: 30분)  
**의존성**: 없음 (지금 바로 가능)

### TODO-003: 백엔드 스택 결정
**무엇**: Supabase vs Firebase vs 자체 Node.js+PostgreSQL 기술 평가. 포인트 원자성 트랜잭션 지원, LLM 캐시 저장, 실시간 리더보드 가능 여부 확인  
**왜**: 늦게 바꾸면 데이터 마이그레이션 비용 크고, 포인트 시스템 서버 사이드 검증 구조가 달라짐  
**권장**: Supabase — Auth, DB, Storage, Realtime 한 번에, 초기 개발속도 10x  
**Effort**: S (인간팀: 반나절 결정 / CC+gstack: 20분 리서치)  
**의존성**: 없음 (지금 바로 가능)

---

## P2 — 출시 전 권장

### TODO-004: 빈 상태(Empty State) UX 설계
**무엇**: 알람 0개일 때 ALM-001, 포인트 0일 때 스토어 진입, BRF-001 첫 로딩 전 스켈레톤 vs 빈 상태 정의  
**왜**: 빈 상태는 신규 사용자 첫 인상을 결정. 온보딩 후 바로 이 화면 보게 됨  
**Effort**: S  
**의존성**: 없음

---

## 미결 결정 사항 (구현 전 필수)

| # | 내용 | 담당 | 기한 |
|---|------|------|------|
| 1 | 백엔드 스택 (Supabase vs 기타) | - | 구현 시작 전 |
| 2 | 알람 iOS/Android 커스텀 사운드 플랫폼 제한 처리 | - | 알람 구현 전 |
| 3 | 오프라인 Stage 2/3 포인트 지급 정책 | - | 기상 플로우 전 |
| 4 | 타임존 변경 시 스트릭 계산 방식 | - | 포인트 시스템 전 |

---

## 리뷰 히스토리

- 2026-04-10: `/plan-ceo-review` — SELECTIVE EXPANSION, PRD_CORE.md 전체 리뷰
- 2026-04-10: UI 구현 TODO 추가 — design/dino-alarm.pen 기반 24개 화면 체크리스트
