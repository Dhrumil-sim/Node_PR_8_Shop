import { format, parse, isAfter, isBefore } from 'date-fns';

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
      return {
        status: 'Open',
        message: 'Open',
      };
    }
  }

  return {
    status: 'Closed',
    message: 'Closed',
  };
}
