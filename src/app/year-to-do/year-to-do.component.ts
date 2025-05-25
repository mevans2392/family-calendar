import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';

interface ToDoItem {
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-year-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './year-to-do.component.html',
  styleUrl: './year-to-do.component.css'
})
export class YearToDoComponent implements OnInit {
  db: Firestore = inject(Firestore);

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  toDoData: Record<string, ToDoItem[]> = {};
  selectedMonth: string | null = null;
  showEventModal = false;
  newToDoTitle = '';
  editingIndex: number | null = null;

  async ngOnInit() {
    for (const month of this.months) {
      const ref = doc(this.db, 'yearlyToDo', month);
      const snap = await getDoc(ref);
      const data = snap.exists() ? (snap.data() as { items: ToDoItem[] }) : { items: [] };
      this.toDoData[month] = data.items;
    }
  }

  openModal(month: string, index: number | null = null) {
    console.log('Modal should open:', month, index);
    this.selectedMonth = month;
    this.editingIndex = index;
    this.newToDoTitle = index !== null ? this.toDoData[month][index].title : '';
    this.showEventModal = true;
}


  closeModal() {
    this.newToDoTitle = '';
    this.editingIndex = null;
    this.showEventModal = false;
  }

  async saveToDo() {
    if (!this.selectedMonth || !this.newToDoTitle.trim()) return;

    const items = this.toDoData[this.selectedMonth];

    if (this.editingIndex !== null) {
      items[this.editingIndex].title = this.newToDoTitle;
    } else {
      items.push({ title: this.newToDoTitle, completed: false });
    }

    const ref = doc(this.db, 'yearlyToDo', this.selectedMonth);
    await setDoc(ref, { items });

    this.closeModal();
  }

  async deleteTask(month: string, index: number) {
    this.toDoData[month].splice(index, 1);
    const ref = doc(this.db, 'yearlyToDo', month);
    await setDoc(ref, { items: this.toDoData[month] });
    
    this.closeModal();
  }

  async toggleComplete(month: string, index: number) {
    this.toDoData[month][index].completed = !this.toDoData[month][index].completed;
    const ref = doc(this.db, 'yearlyToDo', month);
    await setDoc(ref, { items: this.toDoData[month] });
  }
}

