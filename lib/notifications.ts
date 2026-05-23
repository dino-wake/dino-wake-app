import * as Notifications from 'expo-notifications';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { Alarm } from '@/types/alarm';

const ANDROID_PACKAGE = 'com.dinowake.dinowakeapp';
const ALARM_CHANNEL_ID = 'alarms-v2';

// ─── iOS: expo-notifications foreground handler ────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// ─── 요일 변환 ─────────────────────────────────────────────────────────────────

// app 요일: 0=월, 1=화, 2=수, 3=목, 4=금, 5=토, 6=일
// expo 요일: 1=일, 2=월, 3=화, 4=수, 5=목, 6=금, 7=토
function toExpoWeekday(appDay: number): number {
  if (appDay === 6) return 1; // 일요일
  return appDay + 2;          // 월=2, ..., 토=7
}

// app 요일 → JS Date.getDay() (0=일, 1=월, ..., 6=토)
function toJsDay(appDay: number): number {
  return appDay === 6 ? 0 : appDay + 1;
}

// ─── 날짜 계산 ─────────────────────────────────────────────────────────────────

function nextAlarmDate(hour: number, minute: number): Date {
  const now = new Date();
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  if (d < now) d.setDate(d.getDate() + 1);
  return d;
}

function nextAlarmDateForDay(hour: number, minute: number, appDay: number): Date {
  const jsDay = toJsDay(appDay);
  const now = new Date();
  const d = new Date();
  d.setHours(hour, minute, 0, 0);

  const currentJsDay = d.getDay();
  let daysUntil = (jsDay - currentJsDay + 7) % 7;
  if (daysUntil === 0 && d < now) daysUntil = 7;
  d.setDate(d.getDate() + daysUntil);
  return d;
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const REPEAT_WEEKS = 4; // 4주치 예약

// ─── 권한 요청 ─────────────────────────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alarms-fallback', {
      name: '알람 (iOS 호환)',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [100, 500, 100, 500],
      lightColor: '#3D8A5A',
      sound: 'default',
    });

    // Android 13+ (API 33+): POST_NOTIFICATIONS 런타임 권한 요청
    if (Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  }

  const { status, canAskAgain } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  if (!canAskAgain) return false;

  const { status: newStatus } = await Notifications.requestPermissionsAsync({
    ios: { allowSound: true },
  });
  return newStatus === 'granted';
}

// Android 14+(API 34+): USE_FULL_SCREEN_INTENT 설정 화면으로 이동
// 알람이 다른 앱 위에서 자동으로 열리려면 사용자가 직접 허용해야 함
export async function openFullScreenIntentSettings(): Promise<void> {
  if (Platform.OS !== 'android' || Platform.Version < 34) return;
  await Linking.sendIntent('android.settings.MANAGE_APP_USE_FULL_SCREEN_INTENT', [
    { key: 'android.provider.extra.APP_PACKAGE', value: ANDROID_PACKAGE },
  ]);
}

// ─── Android: notifee 스케줄링 ─────────────────────────────────────────────────

async function scheduleAlarmNotificationsAndroid(alarm: Alarm): Promise<string[]> {
  const notifee = (await import('@notifee/react-native')).default;
  const { TriggerType, AndroidCategory, AndroidImportance } = await import('@notifee/react-native');

  await notifee.createChannel({
    id: ALARM_CHANNEL_ID,
    name: '알람',
    importance: AndroidImportance.HIGH,
    vibration: true,
    vibrationPattern: [100, 500, 100, 500],
    sound: 'default',
    bypassDnd: true,
  });

  const notifContent = {
    title: alarm.label,
    body: '알람이 울리고 있어요! 공룡을 깨워주세요 🦕',
    data: { alarmId: alarm.id },
    android: {
      channelId: ALARM_CHANNEL_ID,
      category: AndroidCategory.ALARM,
      importance: AndroidImportance.HIGH,
      fullScreenAction: { id: 'default', launchActivity: `${ANDROID_PACKAGE}.MainActivity` },
      pressAction: { id: 'default' },
      smallIcon: 'notification_icon',
    },
  };

  const ids: string[] = [];

  if (alarm.days.length === 0) {
    const id = await notifee.createTriggerNotification(notifContent, {
      type: TriggerType.TIMESTAMP,
      timestamp: nextAlarmDate(alarm.hour, alarm.minute).getTime(),
      alarmManager: { allowWhileIdle: true },
    });
    ids.push(id);
  } else {
    for (const day of alarm.days) {
      const base = nextAlarmDateForDay(alarm.hour, alarm.minute, day);
      for (let week = 0; week < REPEAT_WEEKS; week++) {
        const ts = base.getTime() + week * WEEK_MS;
        const id = await notifee.createTriggerNotification(notifContent, {
          type: TriggerType.TIMESTAMP,
          timestamp: ts,
          alarmManager: { allowWhileIdle: true },
        });
        ids.push(id);
      }
    }
  }

  return ids;
}

async function cancelAlarmNotificationsAndroid(notificationIds: string[]): Promise<void> {
  const notifee = (await import('@notifee/react-native')).default;
  await notifee.cancelTriggerNotifications(notificationIds);
}

// ─── iOS: expo-notifications 스케줄링 ─────────────────────────────────────────

async function scheduleAlarmNotificationsIOS(alarm: Alarm): Promise<string[]> {
  const ids: string[] = [];

  const content: Notifications.NotificationContentInput = {
    title: alarm.label,
    body: '알람이 울리고 있어요! 공룡을 깨워주세요 🦕',
    data: { alarmId: alarm.id },
    sound: alarm.sound ? 'default' : undefined,
  };

  if (alarm.days.length === 0) {
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: nextAlarmDate(alarm.hour, alarm.minute),
      },
    });
    ids.push(id);
  } else {
    for (const day of alarm.days) {
      const id = await Notifications.scheduleNotificationAsync({
        content,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: toExpoWeekday(day),
          hour: alarm.hour,
          minute: alarm.minute,
        },
      });
      ids.push(id);
    }
  }

  return ids;
}

// ─── 공개 API ─────────────────────────────────────────────────────────────────

export async function scheduleAlarmNotifications(alarm: Alarm): Promise<string[]> {
  if (Platform.OS === 'android') {
    return scheduleAlarmNotificationsAndroid(alarm);
  }
  return scheduleAlarmNotificationsIOS(alarm);
}

export async function cancelAlarmNotifications(notificationIds: string[]): Promise<void> {
  if (Platform.OS === 'android') {
    return cancelAlarmNotificationsAndroid(notificationIds);
  }
  await Promise.all(
    notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

export async function scheduleSnoozeNotification(alarm: Alarm): Promise<string> {
  const snoozeDate = new Date(Date.now() + 5 * 60 * 1000);

  if (Platform.OS === 'android') {
    const notifee = (await import('@notifee/react-native')).default;
    const { TriggerType, AndroidCategory, AndroidImportance } = await import('@notifee/react-native');
    return notifee.createTriggerNotification(
      {
        title: `${alarm.label} (스누즈)`,
        body: '5분이 지났어요! 이제 일어날 시간이에요 🦕',
        data: { alarmId: alarm.id },
        android: {
          channelId: ALARM_CHANNEL_ID,
          category: AndroidCategory.ALARM,
          importance: AndroidImportance.HIGH,
          fullScreenAction: { id: 'default', launchActivity: `${ANDROID_PACKAGE}.MainActivity` },
          pressAction: { id: 'default' },
          smallIcon: 'notification_icon',
        },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: snoozeDate.getTime(),
        alarmManager: { allowWhileIdle: true },
      },
    );
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `${alarm.label} (스누즈)`,
      body: '5분이 지났어요! 이제 일어날 시간이에요 🦕',
      data: { alarmId: alarm.id },
      sound: alarm.sound ? 'default' : undefined,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: snoozeDate,
    },
  });
}
