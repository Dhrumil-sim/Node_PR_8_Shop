import {
  format,
  parse,
  isAfter,
  isBefore,
  addDays,
  differenceInHours,
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
      const hoursLeft = differenceInHours(closeTime, now);
      return {
        status: 'Open',
        message: `Open, The shop will be closed within ${hoursLeft} hrs`,
      };
    }
  }

  // Shop is closed, find next open time
  const todayIndex = DAYS[currentDay];
  for (let i = 1; i <= 7; i++) {
    const dayToCheck = (todayIndex + i) % 7;
    const nextDay = Object.keys(DAYS).find((day) => DAYS[day] === dayToCheck);
    const schedule = SHOP_SCHEDULE.find((s) => s.day === nextDay);
    if (schedule && nextDay) {
      const nextOpen = addDays(parse(schedule.open, 'hh:mm a', now), i);
      const hoursLeft = differenceInHours(nextOpen, now);
      return {
        status: 'Closed',
        message: `Closed. The shop will be open after ${hoursLeft} hrs`,
      };
    }
  }

  return {
    status: 'Closed',
    message: 'Closed. No upcoming open time found.',
  };
}
