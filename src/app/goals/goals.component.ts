import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';

interface WeekGoal {
  id?: string;
  title: string;
  uid: string;
  completed?: boolean;
  userColor?: string;
}


@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './goals.component.html',
  styleUrl: './goals.component.css'
})
export class GoalsComponent {
  db: Firestore = inject(Firestore);
  auth: Auth = inject(Auth);
  users$ = user(this.auth);

  uid: string = '';
  weeklyGoal: WeekGoal[] = [];
  showModal = false;
  newGoalTitle = '';
  selectedUserId: string | null = null;
  editingGoal: WeekGoal | null = null;

  USER_COLORS: Record<string, string> = {
    'qpRdiNU87IShdxHrFf1uZZRyLql1': 'green',
    'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2': 'purple',
    'uid-3': 'red',
    // 'uid-4': 'blue',
    // 'uid-5': 'orange',
  };

  users = [
    { uid: 'qpRdiNU87IShdxHrFf1uZZRyLql1', name: 'Dada' },
    { uid: 'kc0kSHF8wSbz4vbVyJ8TjFT3Hjo2', name: 'Mama' },
    { uid: 'uid-3', name: 'Riley' },
    // { uid: 'uid-4', name: 'Mimi' },
    // { uid: 'uid-5', name: 'Anyone' },
  ];

  ngOnInit(): void {
    this.users$.subscribe((user) => {
      if(user) {
        this.uid = user.uid;
        const ref = collection(this.db, 'weeklyGoals');
        const q = query(ref, orderBy('uid'));

        collectionData(q, { idField: 'id' }).subscribe((goals: any[]) => {
          this.weeklyGoal = goals.map((g) => ({
            id: g.id,
            title: g.title,
            uid: g.uid,
            userColor: this.USER_COLORS[g.uid] || 'grey',
            completed: false,
          }));
        })
      }
    })
  }

  async deleteCompleted() {
    const goalToDelete = this.weeklyGoal.filter(goal => goal.completed);
    for(const goal of goalToDelete) {
      if(goal.id) {
        await deleteDoc(doc(this.db, 'weeklyGoals', goal.id));
      }
    }
  }

  async saveGoals() {
    if(!this.newGoalTitle || !this.selectedUserId) {
      alert("Please enter title and user");
      return;
    }

    const newGoal: Partial<WeekGoal> = {
      title: this.newGoalTitle,
      uid: this.selectedUserId
    };

    await addDoc(collection(this.db, 'weeklyGoals'), newGoal);
    this.closeModal();
  }

  editGoal(goal: WeekGoal) {
    this.editingGoal = goal;
    this.newGoalTitle = goal.title;
    this.selectedUserId = goal.uid;
    this.showModal = true;
  }

  async updateGoal() {
    if(!this.editingGoal || !this.editingGoal.id || !this.newGoalTitle || !this.selectedUserId) {
      alert("missing information");
      return;
    }

    const updatedData = {
      title: this.newGoalTitle,
      uid: this.selectedUserId
    };

    await updateDoc(doc(this.db, 'weeklyGoals', this.editingGoal.id), updatedData);
    this.closeModal();
  }

  getGoalsForUser(uid: string): WeekGoal[] {
    return this.weeklyGoal.filter(goal => goal.uid === uid);
  }

  getThisWeeksFriday(): string {
    const today = new Date();
    const dayOfWeek = today.getDay(); // Sunday = 0, ..., Saturday = 6

    const friday = new Date(today);

    if (dayOfWeek === 6) {
      // If today is Saturday, show next week's Friday
      friday.setDate(today.getDate() + 6);
    } else {
      // Otherwise, show this week's Friday
      const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
      friday.setDate(today.getDate() + daysUntilFriday);
    }

    // Format: MM/DD
    const month = friday.getMonth() + 1;
    const date = friday.getDate();
    return `${month}/${date}`;
}



  openModal() {
    this.newGoalTitle = '';
    this.selectedUserId = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
