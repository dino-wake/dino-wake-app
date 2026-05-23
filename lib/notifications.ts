import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Alarm } from '@/types/alarm';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// app 요일: 0=월, 1=화, 2=수, 3=목, 4=금, 5=토, 6=일
// expo 요일: 1=일, 2=월, 3=화, 4=수, 5=목, 6=금, 7=토
function toExpoWeekday(appDay: number): number {
  if (appDay === 6) return 1; // 일요일
  return appDay + 2;          // 월=2, ..., 토=7
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alarms', {
      name: '알람',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3D8A5A',
      sound: 'default',
    });
  }

  const { status, canAskAgain } = await Notifications.getPermissionsAsync();
  if (status === 'granted') return true;
  if (!canAskAgain) return false;

  const { status: newStatus } = await Notifications.requestPermissionsAsync();
  return newStatus === 'granted';
}

export async function scheduleAlarmNotifications(alarm: Alarm): Promise<string[]> {
  const ids: string[] = [];

  const content: Notifications.NotificationContentInput = {
    title: alarm.label,
    body: '알람이 울리고 있어요! 공룡을 깨워주세요 🦕',
    data: { alarmId: alarm.id },
    sound: alarm.sound ? 'default' : undefined,
  };

  if (alarm.days.length === 0) {
    // 반복 없음: 다음 해당 시각에 1회 발송
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: nextAlarmDate(alarm.hour, alarm.minute),
      },
    });
    ids.push(id);
  } else {
    // 요일 반복: 각 요일마다 weekly 트리거
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

export async function cancelAlarmNotifications(notificationIds: string[]): Promise<void> {
  await Promise.all(
    notificationIds.map((id) => Notifications.cancelScheduledNotificationAsync(id)),
  );
}

export async function scheduleSnoozeNotification(alarm: Alarm): Promise<string> {
  const snoozeDate = new Date(Date.now() + 5 * 60 * 1000);
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

function nextAlarmDate(hour: number, minute: number): Date {
  const now = new Date();
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  if (d <= now) d.setDate(d.getDate() + 1);
  return d;
}
