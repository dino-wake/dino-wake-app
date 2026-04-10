export type Alarm = {
  id: string;
  hour: number;
  minute: number;
  label: string;
  memo: string;
  days: number[]; // 0=월, 1=화, 2=수, 3=목, 4=금, 5=토, 6=일
  enabled: boolean;
  sound: boolean;
  snooze: boolean;
};

export const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function formatDays(days: number[]): string {
  if (days.length === 0) return '반복 없음';
  if (days.length === 7) return '매일';
  if (JSON.stringify(days.sort()) === JSON.stringify([0, 1, 2, 3, 4])) return '주중';
  if (JSON.stringify(days.sort()) === JSON.stringify([5, 6])) return '주말';
  return days
    .slice()
    .sort((a, b) => a - b)
    .map((d) => DAY_LABELS[d])
    .join('  ');
}
