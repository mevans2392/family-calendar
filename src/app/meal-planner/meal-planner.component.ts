import { Component, OnInit, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth, user } from '@angular/fire/auth';

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

  selectedDay: string | null = null;
  selectedMeal: string | null = null;
  mealInput: string = '';
  showModal: boolean = false;

  async ngOnInit() {
    for (const day of this.days) {
      const ref = doc(this.db, 'mealPlanner', day);
      const snap = await getDoc(ref);
      if(snap.exists()) {
        this.mealData[day] = snap.data();
      } else {
        this.mealData[day] = {};
      }
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


}
