import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('dino-wake.db');

// 단일 레코드 테이블 (id=1 고정)
export function initDailyMemoDb() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS daily_memo (
      id INTEGER PRIMARY KEY DEFAULT 1,
      content TEXT NOT NULL DEFAULT '',
      updated_at INTEGER NOT NULL DEFAULT 0
    )
  `);
}

type MemoRow = { id: number; content: string; updated_at: number };

export function getDailyMemo(): string {
  const row = db.getFirstSync<MemoRow>('SELECT * FROM daily_memo WHERE id = 1');
  return row?.content ?? '';
}

export function upsertDailyMemo(content: string) {
  db.runSync(
    'INSERT INTO daily_memo (id, content, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET content=excluded.content, updated_at=excluded.updated_at',
    [content, Date.now()],
  );
}

export function deleteDailyMemo() {
  db.runSync('DELETE FROM daily_memo WHERE id = 1');
}
