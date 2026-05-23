import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('dino-wake.db');

export type BriefingSettings = {
  narration: boolean;  // 읽어주기
  weather: boolean;
  fortuneZodiac: boolean;  // 띠별 운세
  fortuneStar: boolean;    // 별자리 운세
  news: boolean;
};

const DEFAULTS: BriefingSettings = {
  narration: false,
  weather: true,
  fortuneZodiac: false,
  fortuneStar: false,
  news: true,
};

export function initBriefingSettingsDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS briefing_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      narration INTEGER NOT NULL DEFAULT 0,
      weather INTEGER NOT NULL DEFAULT 1,
      fortune_zodiac INTEGER NOT NULL DEFAULT 0,
      fortune_star INTEGER NOT NULL DEFAULT 0,
      news INTEGER NOT NULL DEFAULT 1
    )
  `);
}

type SettingsRow = {
  narration: number;
  weather: number;
  fortune_zodiac: number;
  fortune_star: number;
  news: number;
};

export function getBriefingSettings(): BriefingSettings {
  const row = db.getFirstSync<SettingsRow>('SELECT * FROM briefing_settings WHERE id = 1');
  if (!row) return DEFAULTS;
  return {
    narration: row.narration === 1,
    weather: row.weather === 1,
    fortuneZodiac: row.fortune_zodiac === 1,
    fortuneStar: row.fortune_star === 1,
    news: row.news === 1,
  };
}

export function saveBriefingSettings(s: BriefingSettings) {
  db.runSync(
    `INSERT INTO briefing_settings (id, narration, weather, fortune_zodiac, fortune_star, news)
     VALUES (1, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       narration=excluded.narration,
       weather=excluded.weather,
       fortune_zodiac=excluded.fortune_zodiac,
       fortune_star=excluded.fortune_star,
       news=excluded.news`,
    [
      s.narration ? 1 : 0,
      s.weather ? 1 : 0,
      s.fortuneZodiac ? 1 : 0,
      s.fortuneStar ? 1 : 0,
      s.news ? 1 : 0,
    ],
  );
}
