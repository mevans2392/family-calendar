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

export interface FamilyMember {
    id: string;
    name: string;
    color: string;
}

export interface WeekGoal {
  id?: string;
  title: string;
  uid: string;
  completed?: boolean;
  userColor?: string;
}

export interface ToDoItem {
  id?: string;
  title: string;
  uid: string;
  completed?: boolean;
  userColor?: string;
}

export interface yearToDoItem {
  month: string;
  items: ToDoItem[];
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