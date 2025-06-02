export interface CalendarEvent {
  id?: string;
  title: string;
  date: string;
  isAllDay: boolean;
  uid: string;
  userColor?: string;
  startTime?: string;
  endTime?: string;
}

export interface FamilyMember {
    id: string;
    name: string;
    color: string;
}