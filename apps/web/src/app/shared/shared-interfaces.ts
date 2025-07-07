export interface Family {
  id: string;
  familyName: string;
  createdBy: string;
  createdAt: any;
  subStatus: 'free' | 'trial' | 'paid' | 'expired';
  trialStart: string;
  trialLength: number;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    color: string;
    points: number;
}

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

export interface Reward {
  id: string;
  title: string;
  points: number;
}

export interface ShoppingItem {
  id?: string;
  title: string;
  title_lower?: string;
  completed: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  directions: string;
  day?: string;
  mealType?: string;
}