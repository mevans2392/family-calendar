import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth, user } from '@angular/fire/auth';
import { FamilyMembersService } from '../../services/family-members.service';
import { GoalsService } from '../../services/goals.service';
import { WeekGoal, FamilyMember } from '../../shared/shared-interfaces';
import { getThisWeeksFriday } from '../../shared/date-utils';


@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent implements OnInit {
  private goalsService = inject(GoalsService);
  private familyService = inject(FamilyMembersService);
  private auth = inject(Auth);
  user$ = user(this.auth);

  uid: string = '';
  familyMembers: FamilyMember[] = [];
  goals: WeekGoal[] = [];
  showModal = false;
  newGoalTitle = '';
  selectedUserId: string | null = null;
  editingGoal: WeekGoal | null = null;
  private goalSub: any;
  getThisWeeksFriday = getThisWeeksFriday;


  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if(user) {
        this.uid = user.uid;
        this.loadGoals();
        this.loadMembers();
      }
    });
  }

  async loadGoals() {
    if(this.goalSub) this.goalSub.unsubscribe();

    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;

      this.goalsService.loadGoals().then(stream$ => {
        this.goalSub = stream$.subscribe(goals => {
          this.goals = goals;
        })
      })
    })
  }

  async loadMembers() {
    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => this.familyMembers = members);
  }

  getColorForUid(uid: string): string {
    return this.familyMembers.find(m => m.id === uid)?.color || 'grey';
  }

  async deleteGoals() {
    const completedGoals = this.goals.filter(goal => goal.completed);

    if(completedGoals.length === 0) {
      alert('No completed goals to delete');
      return;
    }

    const confirmDelete = confirm(`Delete ${completedGoals.length} completed goal(s)?`);
    if(!confirmDelete) return;

    for(const goal of completedGoals) {
      if(goal.id) {
        await this.goalsService.deleteGoal(goal.id);
      }
    }
  }

  async saveGoal() {
    if(!this.newGoalTitle || !this.selectedUserId) {
      alert('Please enter title and user');
      return;
    }

    const goal: WeekGoal = {
      id: this.editingGoal?.id,
      title: this.newGoalTitle,
      uid: this.selectedUserId,
    };
    await this.goalsService.saveGoal(goal);

    this.clearForm();
    this.showModal = false;
  }

  openModal() {
    this.editingGoal = null;
    this.newGoalTitle = '';
    this.selectedUserId = null;
    this.showModal = true;
  }

  getGoalsForUser(uid: string): WeekGoal[] {
    return this.goals.filter(goal => goal.uid === uid);
  }

  handleGoalClick(goal: WeekGoal) {
    this.editingGoal = {
      id: goal.id,
      title: goal.title,
      uid: goal.uid,
    };
    this.newGoalTitle = goal.title;
    this.selectedUserId = goal.uid;
    this.showModal = true;
  }

  clearForm() {
    this.newGoalTitle = '';
    this.selectedUserId = null;
    this.editingGoal = null;
  }

}
