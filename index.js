import 'react-native-get-random-values';
import { Platform } from 'react-native';

// notifee 백그라운드 이벤트 핸들러 (Android only)
// 앱이 완전히 종료된 상태에서 알림 상호작용 처리
if (Platform.OS === 'android') {
  const notifee = require('@notifee/react-native').default;
  const { EventType } = require('@notifee/react-native');

  notifee.onBackgroundEvent(async ({ type }) => {
    // DELIVERED: fullScreenAction이 MainActivity를 실행 → app/_layout.tsx의 getInitialNotification()이 라우팅 처리
    // PRESS: 사용자가 알림 배너를 탭 → fullScreenAction이 앱 실행 → getInitialNotification()이 처리
    // DISMISSED: 사용자가 알림을 닫음 → 별도 처리 없음
    if (type === EventType.DISMISSED) return;
  });
}

import 'expo-router/entry';
