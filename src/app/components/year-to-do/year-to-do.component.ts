import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, user } from '@angular/fire/auth';
import { RouterModule } from '@angular/router';
import { FamilyMember, ToDoItem } from '../../shared/shared-interfaces';
import { YearToDoService } from '../../services/year-to-do.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-year-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavComponent],
  templateUrl: './year-to-do.component.html',
  styleUrl: './year-to-do.component.css'
})
export class YearToDoComponent implements OnInit {
  private yearToDoService = inject(YearToDoService);
  private familyService = inject(FamilyMembersService);
  private auth = inject(Auth);
  user$ = user(this.auth);

  uid: string = '';
  familyMembers: FamilyMember[] = [];
  toDoData: Record<string, ToDoItem[]> = {};
  selectedMonth: string | null = null;
  showModal = false;
  newToDoTitle = '';
  editingIndex: number | null = null;
  private toDoSub: any;
  selectedUserId: string | null = null;

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  async ngOnInit() {
    this.user$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.loadToDos();
        this.loadMembers();
      }
    });
  }

  getColorForUid(uid: string): string {
    return this.familyMembers.find(m => m.id === uid)?.color || 'grey';
  }

  openModal(month: string, index: number | null = null) {
    this.selectedMonth = month;
    this.editingIndex = index;
    this.newToDoTitle = index !== null ? this.toDoData[month][index].title : '';
    this.selectedUserId = index !== null ? this.toDoData[month][index].uid : null;
    this.showModal = true;
  }

  closeModal() {
    this.newToDoTitle = '';
    this.editingIndex = null;
    this.selectedUserId = null;
    this.showModal = false;
  }

  async loadToDos() {
    if (this.toDoSub) this.toDoSub.unsubscribe();

    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;

      this.yearToDoService.loadToDos().then(stream$ => {
        this.toDoSub = stream$.subscribe(data => {
          // Transform Record<string, yearToDoItem> into Record<string, ToDoItem[]>
          this.toDoData = {};
          for (const month in data) {
            this.toDoData[month] = data[month].items;
          }
        });
      });
    });
  }

  async loadMembers() {
    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;
    });
  }

  async saveToDo() {
    if (!this.selectedMonth || !this.newToDoTitle.trim() || !this.selectedUserId) return;

    const month = this.selectedMonth;
    const items = this.toDoData[month] || [];

    if (this.editingIndex !== null) {
      items[this.editingIndex].title = this.newToDoTitle;
    } else {
      items.push({ title: this.newToDoTitle, completed: false, uid: this.selectedUserId });
    }

    await this.yearToDoService.saveToDos(month, items);
    this.closeModal();
  }

  async deleteTask(month: string, index: number) {
    await this.yearToDoService.deleteToDoFromMonth(month, index);
    this.closeModal();
    this.loadToDos(); // refresh data
  }

  async toggleComplete(month: string, index: number) {
    const items = this.toDoData[month];
    items[index].completed = !items[index].completed;

    await this.yearToDoService.saveToDos(month, items);
  }
}


