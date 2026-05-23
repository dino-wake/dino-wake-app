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
  notificationIds: string[];
};

export const DAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

// app 요일: 0=월, 1=화, 2=수, 3=목, 4=금, 5=토, 6=일
// JS getDay(): 0=일, 1=월, ..., 6=토
function toJsDay(appDay: number): number {
  return appDay === 6 ? 0 : appDay + 1;
}

function nextFireDate(hour: number, minute: number, days: number[]): Date {
  const now = new Date();
  const candidate = new Date();
  candidate.setSeconds(0, 0);
  candidate.setHours(hour, minute, 0, 0);

  if (days.length === 0) {
    if (candidate <= now) candidate.setDate(candidate.getDate() + 1);
    return candidate;
  }

  const jsDays = days.map(toJsDay);
  for (let offset = 0; offset < 8; offset++) {
    const d = new Date(now);
    d.setDate(now.getDate() + offset);
    d.setHours(hour, minute, 0, 0);
    if (d > now && jsDays.includes(d.getDay())) return d;
  }

  // fallback
  candidate.setDate(candidate.getDate() + 1);
  return candidate;
}

export function getNextAlarmLabel(alarms: Alarm[]): string {
  const enabled = alarms.filter((a) => a.enabled);
  if (enabled.length === 0) return '설정된 알람 없음';

  const now = new Date();
  const next = enabled
    .map((a) => nextFireDate(a.hour, a.minute, a.days))
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const diffMs = next.getTime() - now.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 60) return `${diffMin}분 후 알람`;
  const hours = Math.floor(diffMin / 60);
  const mins = diffMin % 60;
  return mins > 0 ? `${hours}시간 ${mins}분 후 알람` : `${hours}시간 후 알람`;
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
