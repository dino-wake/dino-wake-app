import 'react-native-get-random-values';
import { Platform } from 'react-native';

// notifee 백그라운드 이벤트 핸들러 (Android only)
// 앱이 완전히 종료된 상태에서 알림 상호작용 처리
if (Platform.OS === 'android') {
  const notifee = require('@notifee/react-native').default;
  notifee.onBackgroundEvent(async () => {
    // fullScreenAction이 앱 실행을 처리하므로 별도 처리 불필요
    // 향후 스누즈 액션 처리 시 여기에 추가
  });
}

import 'expo-router/entry';
