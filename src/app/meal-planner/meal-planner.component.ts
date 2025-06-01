import { Component, OnInit, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, user } from '@angular/fire/auth';
import { ScreenSizeService } from '../screen-size.service';
import { onSnapshot } from 'firebase/firestore';


interface MealEntry {
  name: string;
  uid: string;
}

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-planner.component.html',
  styleUrl: './meal-planner.component.css'
})
export class MealPlannerComponent implements OnInit{
  db: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  users$ = user(this.auth);

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  mealData: Record<string, any> = {};

  selectedDayIndex: number = new Date().getDay();
  selectedDay: string = this.days[this.selectedDayIndex];
  selectedMeal: string | null = null;
  showModal: boolean = false;

  editingIndex: number = -1;

  readonly cellWidth = 120;
  readonly cellHeight = 100;

  users = [
  { uid: 'qpRdiNU87IShdxHrFf1uZZRyLql1', name: 'Dada' },
  { uid: 'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2', name: 'Mama' },
  { uid: 'uid-3', name: 'Riley' },
  { uid: 'uid-4', name: 'Mimi' },
  { uid: 'uid-5', name: 'Anyone' },
];

USER_COLORS: Record<string, string> = {
  'qpRdiNU87IShdxHrFf1uZZRyLql1': 'green',
  'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2': 'purple',
  'uid-3': 'red',
  'uid-4': 'blue',
  'uid-5': 'orange',
};

mealInput: MealEntry = { name: '', uid: '' };


  constructor(private screenService: ScreenSizeService) {}

  async ngOnInit() {
    for (const day of this.days) {
      const ref = doc(this.db, 'mealPlanner', day);
      onSnapshot(ref, (snap) => {
        this.mealData[day] = snap.exists() ? snap.data() : {};
      })
    }
  }


  openEventModal(day: string, meal: string) {
    console.log('modal triggered', day, meal);
    this.selectedDay = day;
    this.selectedMeal = meal;

    const existingMeal = this.mealData[day]?.[meal];

    this.mealInput = {
      name: existingMeal?.name || '',
      uid: existingMeal?.uid || '',
    };

    this.showModal = true;
  }

  async saveMeal(): Promise<void> {
    if (!this.selectedDay || !this.selectedMeal) return;

    const ref = doc(this.db, 'mealPlanner', this.selectedDay);

    // Ensure structure exists
    const existingEntries = Array.isArray(this.mealData[this.selectedDay]?.[this.selectedMeal])
      ? this.mealData[this.selectedDay][this.selectedMeal]
      : [];

    const updatePayload: any = {};

    if (this.editingIndex >= 0) {
      // Editing an existing entry
      const updated = [...existingEntries];
      updated[this.editingIndex] = { ...this.mealInput };
      updatePayload[this.selectedMeal] = updated;
      this.editingIndex = -1;
    } else {
      // Adding a new entry
      updatePayload[this.selectedMeal] = [...existingEntries, { ...this.mealInput }];
    }

    try {
      await updateDoc(ref, updatePayload);
    } catch (error) {
      await setDoc(ref, updatePayload);
    }

    // Reflect changes in local state
    if (!this.mealData[this.selectedDay]) {
      this.mealData[this.selectedDay] = {};
    }
    this.mealData[this.selectedDay][this.selectedMeal] = updatePayload[this.selectedMeal];
    this.showModal = false;
  }


  editMeal(day: string, meal: string, entry: MealEntry) {
    this.selectedDay = day;
    this.selectedMeal = meal;
    this.mealInput = { ...entry };
    this.editingIndex = this.mealData[day][meal].findIndex((e: MealEntry) => 
      e.name === entry.name && e.uid === entry.uid
    );
    this.showModal = true;
  }

  async deleteMeal(): Promise<void> {
    if (this.selectedDay && this.selectedMeal && this.editingIndex >= 0) {
      const ref = doc(this.db, 'mealPlanner', this.selectedDay);
      const existingEntries = this.mealData[this.selectedDay][this.selectedMeal] || [];

      const updatedEntries = [...existingEntries];
      updatedEntries.splice(this.editingIndex, 1); // remove 1 item at index

      const updatePayload = {
        [this.selectedMeal]: updatedEntries
      };

      try {
        await updateDoc(ref, updatePayload);
      } catch (error) {
        console.error('Error deleting meal:', error);
      }

      this.mealData[this.selectedDay][this.selectedMeal] = updatedEntries;
      this.editingIndex = -1;
      this.showModal = false;
    }
  }

  get isCompact(): boolean {
    return this.screenService.isTabletOrSmaller();
  }

  get visibleDays(): string[] {
      return this.isCompact ? [this.selectedDay] : this.days;
    }

  previousDay() {
    this.selectedDayIndex = (this.selectedDayIndex - 1 + this.days.length) % this.days.length;
    this.selectedDay = this.days[this.selectedDayIndex];
  }

  nextDay() {
    this.selectedDayIndex = (this.selectedDayIndex + 1) % this.days.length;
    this.selectedDay = this.days[this.selectedDayIndex];
  }

}
