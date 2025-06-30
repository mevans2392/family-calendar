export interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  repeat?: 'daily' | 'weekly' | 'monthly';
  repeatUntil?: string;
  isAllDay: boolean;
  uid: string;
  userColor?: string;
  startTime?: string;
  endTime?: string;
  seriesId?: string;
}

export interface Chore {
  id: string;
  title: string;
  assignedUser?: string;
  points: number;
  complete: boolean;
  lastCompletedAt?: string;
  month?: MonthOption | '';
}

export type MonthOption =
  | 'January' | 'February' | 'March' | 'April'
  | 'May' | 'June' | 'July' | 'August'
  | 'September' | 'October' | 'November' | 'December';

export const MONTHS: MonthOption[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export interface FamilyMember {
    id: string;
    name: string;
    color: string;
    points: number;
}

export interface WeekGoal {
  id?: string;
  title: string;
  uid: string;
  completed?: boolean;
  userColor?: string;
}

export interface ShoppingItem {
  id?: string;
  title: string;
  title_lower?: string;
  completed: boolean;
}

export interface MealEntry {
  name: string;
  uid: string;
}

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string[];
}