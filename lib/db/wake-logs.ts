import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('dino-wake.db');

export function initWakeLogDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS wake_logs (
      id TEXT PRIMARY KEY,
      alarm_id TEXT NOT NULL DEFAULT '',
      woken_at INTEGER NOT NULL,
      alarm_hour INTEGER NOT NULL,
      alarm_minute INTEGER NOT NULL,
      emotion_level INTEGER NOT NULL
    )
  `);
}

export type WakeLog = {
  id: string;
  alarmId: string;
  wokenAt: number;
  alarmHour: number;
  alarmMinute: number;
  emotionLevel: number;
};

export function insertWakeLog(log: WakeLog) {
  db.runSync(
    'INSERT INTO wake_logs (id, alarm_id, woken_at, alarm_hour, alarm_minute, emotion_level) VALUES (?, ?, ?, ?, ?, ?)',
    [log.id, log.alarmId, log.wokenAt, log.alarmHour, log.alarmMinute, log.emotionLevel],
  );
}

export function hasTodayWakeLog(): boolean {
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const row = db.getFirstSync<{ cnt: number }>(
    'SELECT COUNT(*) as cnt FROM wake_logs WHERE woken_at >= ?',
    [todayMidnight],
  );
  return (row?.cnt ?? 0) > 0;
}
