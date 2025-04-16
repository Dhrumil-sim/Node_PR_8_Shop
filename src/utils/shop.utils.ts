import {
  format,
  parse,
  isAfter,
  isBefore,
  addDays,
  differenceInMinutes,
} from 'date-fns';

export interface ShopSchedule {
  day: string;
  open: string;
  close: string;
}

export interface ShopStatus {
  status: 'Open' | 'Closed';
  message: string;
}

const SHOP_SCHEDULE: ShopSchedule[] = [
  { day: 'Mon', open: '07:00 AM', close: '07:00 PM' },
  { day: 'Tue', open: '07:00 AM', close: '07:00 PM' },
  { day: 'Wed', open: '07:00 AM', close: '07:00 PM' },
  { day: 'Thu', open: '07:00 AM', close: '07:00 PM' },
  { day: 'Fri', open: '07:00 AM', close: '07:00 PM' },
];

const DAYS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getCurrentDayShort(): string {
  return format(new Date(), 'EEE');
}

function getCurrentTime(): Date {
  return new Date();
}

export function getShopStatus(): ShopStatus {
  const currentDay = getCurrentDayShort();
  const now = getCurrentTime();
  const todaySchedule = SHOP_SCHEDULE.find((s) => s.day === currentDay);

  if (todaySchedule) {
    const openTime = parse(todaySchedule.open, 'hh:mm a', now);
    const closeTime = parse(todaySchedule.close, 'hh:mm a', now);

    if (isAfter(now, openTime) && isBefore(now, closeTime)) {
      const minutesLeft = differenceInMinutes(closeTime, now);
      const hrs = Math.floor(minutesLeft / 60);
      const mins = minutesLeft % 60;

      const timeLeftMsg =
        hrs > 0
          ? `The shop will close in ${hrs} hr${hrs > 1 ? 's' : ''}${mins > 0 ? ` ${mins} min${mins > 1 ? 's' : ''}` : ''}`
          : `The shop will close in ${mins} min${mins > 1 ? 's' : ''}`;

      return {
        status: 'Open',
        message: `Open. ${timeLeftMsg}`,
      };
    }
  }

  // Shop is closed, find next opening
  const todayIndex = DAYS[currentDay];
  for (let i = 1; i <= 7; i++) {
    const nextDayIndex = (todayIndex + i) % 7;
    const nextDay = Object.keys(DAYS).find((day) => DAYS[day] === nextDayIndex);
    const schedule = SHOP_SCHEDULE.find((s) => s.day === nextDay);

    if (schedule && nextDay) {
      const nextOpen = addDays(parse(schedule.open, 'hh:mm a', now), i);
      const totalMinutes = differenceInMinutes(nextOpen, now);
      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = totalMinutes % 60;

      const timeMsgParts: string[] = [];
      if (days > 0) timeMsgParts.push(`${days} day${days > 1 ? 's' : ''}`);
      if (hours > 0) timeMsgParts.push(`${hours} hr${hours > 1 ? 's' : ''}`);
      if (minutes > 0)
        timeMsgParts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);

      const message = `Closed. The shop will open in ${timeMsgParts.join(' ')}`;

      return {
        status: 'Closed',
        message,
      };
    }
  }

  return {
    status: 'Closed',
    message: 'Closed. No upcoming open time found.',
  };
}
