import { Component, OnInit, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, user } from '@angular/fire/auth';
import { ScreenSizeService } from '../screen-size.service';
import { onSnapshot } from 'firebase/firestore';

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
  mealInput: string = '';
  showModal: boolean = false;

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
    this.mealInput = this.mealData[day]?.[meal] || '';
    this.showModal = true;
  }

  async saveMeal() {
    if (!this.selectedDay || !this.selectedMeal) return;
    const ref = doc(this.db, 'mealPlanner', this.selectedDay);

    const update = { [this.selectedMeal]: this.mealInput };
    try {
      await updateDoc(ref, update);
    } catch (error) {
      await setDoc(ref, update)
    }

    this.mealData[this.selectedDay][this.selectedMeal] = this.mealInput;
    this.showModal = false;
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
