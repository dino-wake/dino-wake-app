import { useCallback, useEffect, useState } from 'react';
import { Alarm } from '@/types/alarm';
import * as AlarmDb from '@/lib/db/alarms';
import * as AlarmScheduler from '@/lib/notifications';

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AlarmDb.initAlarmDb();
    setAlarms(AlarmDb.getAllAlarms());
    setLoading(false);
  }, []);

  const addAlarm = useCallback(async (data: Omit<Alarm, 'id' | 'notificationIds'>) => {
    const id = Date.now().toString();
    let notificationIds: string[] = [];

    if (data.enabled) {
      const alarm: Alarm = { ...data, id, notificationIds: [] };
      notificationIds = await AlarmScheduler.scheduleAlarmNotifications(alarm);
    }

    const alarm: Alarm = { ...data, id, notificationIds };
    AlarmDb.insertAlarm(alarm);
    setAlarms((prev) => [...prev, alarm]);
  }, []);

  const updateAlarm = useCallback(async (updated: Alarm) => {
    const old = AlarmDb.getAlarm(updated.id);
    if (old && old.notificationIds.length > 0) {
      await AlarmScheduler.cancelAlarmNotifications(old.notificationIds);
    }

    let notificationIds: string[] = [];
    if (updated.enabled) {
      notificationIds = await AlarmScheduler.scheduleAlarmNotifications(updated);
    }

    const final: Alarm = { ...updated, notificationIds };
    AlarmDb.updateAlarm(final);
    setAlarms((prev) => prev.map((a) => (a.id === final.id ? final : a)));
  }, []);

  const toggleAlarm = useCallback(async (id: string, enabled: boolean) => {
    const alarm = AlarmDb.getAlarm(id);
    if (!alarm) return;

    if (!enabled) {
      await AlarmScheduler.cancelAlarmNotifications(alarm.notificationIds);
      const updated: Alarm = { ...alarm, enabled: false, notificationIds: [] };
      AlarmDb.updateAlarm(updated);
      setAlarms((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } else {
      const notificationIds = await AlarmScheduler.scheduleAlarmNotifications(alarm);
      const updated: Alarm = { ...alarm, enabled: true, notificationIds };
      AlarmDb.updateAlarm(updated);
      setAlarms((prev) => prev.map((a) => (a.id === id ? updated : a)));
    }
  }, []);

  const deleteAlarm = useCallback(async (id: string) => {
    const alarm = AlarmDb.getAlarm(id);
    if (alarm && alarm.notificationIds.length > 0) {
      await AlarmScheduler.cancelAlarmNotifications(alarm.notificationIds);
    }
    AlarmDb.deleteAlarm(id);
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { alarms, loading, addAlarm, updateAlarm, toggleAlarm, deleteAlarm };
}
