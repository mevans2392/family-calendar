import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, user } from '@angular/fire/auth';
import { MealPlannerService } from '../../services/meal-planner.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { ScreenSizeService } from '../../services/screen-size.service';
import { FamilyMember, MealEntry } from '../../shared/shared-interfaces';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-planner.component.html',
  styleUrl: './meal-planner.component.css'
})
export class MealPlannerComponent implements OnInit {
  private mealPlannerService = inject(MealPlannerService);
  private familyService = inject(FamilyMembersService);
  private screenService = inject(ScreenSizeService);
  private auth = inject(Auth);
  user$ = user(this.auth);

  uid: string = '';
  familyMembers: FamilyMember[] = [];
  USER_COLORS: Record<string, string> = {};
  mealData: Record<string, any> = {};

  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
  selectedDayIndex = new Date().getDay();
  selectedDay = this.days[this.selectedDayIndex];
  selectedMeal: string | null = null;
  showModal = false;
  mealInput: MealEntry = { name: '', uid: '' };
  editingIndex: number | null = null;

  ngOnInit(): void {
    this.user$.subscribe(user => {
      if (user) {
        this.uid = user.uid;
        this.loadFamilyMembers();
        this.loadMealData();
      }
    });
  }

  get isCompact(): boolean {
    return this.screenService.isTabletOrSmaller();
  }

  get visibleDays(): string[] {
    return this.isCompact ? [this.selectedDay] : this.days;
  }

  getColorForUid(uid: string): string {
    return this.USER_COLORS[uid] || 'grey';
  }

  async loadFamilyMembers() {
    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;
      this.USER_COLORS = members.reduce((map, member) => {
        map[member.id] = member.color;
        return map;
      }, {} as Record<string, string>);
    });
  }

  loadMealData() {
    this.mealPlannerService.subscribeToMealPlanner(this.days, data => {
      this.mealData = data;
    });
  }

  openEventModal(day: string, meal: string, entryIndex: number | null = null) {
    this.selectedDay = day;
    this.selectedMeal = meal;

    if (entryIndex !== null) {
      const entry = this.mealData[day][meal][entryIndex];
      this.mealInput = { ...entry };
      this.editingIndex = entryIndex;
    } else {
      this.mealInput = { name: '', uid: '' };
      this.editingIndex = null;
    }

    this.showModal = true;
  }

  closeModal() {
    this.mealInput = { name: '', uid: '' };
    this.editingIndex = null;
    this.showModal = false;
  }

  async saveMeal() {
    if (!this.selectedDay || !this.selectedMeal || !this.mealInput.name || !this.mealInput.uid) return;

    const existing = this.mealData[this.selectedDay]?.[this.selectedMeal] || [];

    if (this.editingIndex !== null) {
      existing[this.editingIndex] = { ...this.mealInput };
    } else {
      existing.push({ ...this.mealInput });
    }

    await this.mealPlannerService.saveMeal(this.selectedDay, this.selectedMeal, existing);
    this.closeModal();
  }

  editMeal(day: string, meal: string, entry: MealEntry) {
    this.selectedDay = day;
    this.selectedMeal = meal;
    this.mealInput = { ...entry };

    const entries = this.mealData[day]?.[meal] || [];
    this.editingIndex = entries.findIndex((e: MealEntry) => e.name === entry.name && e.uid === entry.uid);

    this.showModal = true;
  }


  async deleteMeal() {
    if (
      this.selectedDay &&
      this.selectedMeal &&
      this.editingIndex !== null &&
      this.editingIndex >= 0
    ) {
      const updated = [...this.mealData[this.selectedDay][this.selectedMeal]];
      updated.splice(this.editingIndex, 1);

      await this.mealPlannerService.saveMeal(this.selectedDay, this.selectedMeal, updated);
      this.closeModal();
    }
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
