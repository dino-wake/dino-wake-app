import * as SQLite from 'expo-sqlite';
import { Alarm } from '@/types/alarm';

const db = SQLite.openDatabaseSync('dino-wake.db');

export function initAlarmDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS alarms (
      id TEXT PRIMARY KEY,
      hour INTEGER NOT NULL,
      minute INTEGER NOT NULL,
      label TEXT NOT NULL,
      memo TEXT NOT NULL DEFAULT '',
      days TEXT NOT NULL DEFAULT '[]',
      enabled INTEGER NOT NULL DEFAULT 1,
      sound INTEGER NOT NULL DEFAULT 1,
      snooze INTEGER NOT NULL DEFAULT 0,
      notification_ids TEXT NOT NULL DEFAULT '[]'
    )
  `);
}

type AlarmRow = {
  id: string;
  hour: number;
  minute: number;
  label: string;
  memo: string;
  days: string;
  enabled: number;
  sound: number;
  snooze: number;
  notification_ids: string;
};

function rowToAlarm(row: AlarmRow): Alarm {
  return {
    id: row.id,
    hour: row.hour,
    minute: row.minute,
    label: row.label,
    memo: row.memo,
    days: JSON.parse(row.days),
    enabled: row.enabled === 1,
    sound: row.sound === 1,
    snooze: row.snooze === 1,
    notificationIds: JSON.parse(row.notification_ids),
  };
}

export function getAllAlarms(): Alarm[] {
  const rows = db.getAllSync<AlarmRow>('SELECT * FROM alarms ORDER BY hour, minute');
  return rows.map(rowToAlarm);
}

export function getAlarm(id: string): Alarm | null {
  const row = db.getFirstSync<AlarmRow>('SELECT * FROM alarms WHERE id = ?', [id]);
  return row ? rowToAlarm(row) : null;
}

export function insertAlarm(alarm: Alarm) {
  db.runSync(
    'INSERT INTO alarms (id, hour, minute, label, memo, days, enabled, sound, snooze, notification_ids) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      alarm.id,
      alarm.hour,
      alarm.minute,
      alarm.label,
      alarm.memo,
      JSON.stringify(alarm.days),
      alarm.enabled ? 1 : 0,
      alarm.sound ? 1 : 0,
      alarm.snooze ? 1 : 0,
      JSON.stringify(alarm.notificationIds),
    ],
  );
}

export function updateAlarm(alarm: Alarm) {
  db.runSync(
    'UPDATE alarms SET hour=?, minute=?, label=?, memo=?, days=?, enabled=?, sound=?, snooze=?, notification_ids=? WHERE id=?',
    [
      alarm.hour,
      alarm.minute,
      alarm.label,
      alarm.memo,
      JSON.stringify(alarm.days),
      alarm.enabled ? 1 : 0,
      alarm.sound ? 1 : 0,
      alarm.snooze ? 1 : 0,
      JSON.stringify(alarm.notificationIds),
      alarm.id,
    ],
  );
}

export function deleteAlarm(id: string) {
  db.runSync('DELETE FROM alarms WHERE id = ?', [id]);
}
