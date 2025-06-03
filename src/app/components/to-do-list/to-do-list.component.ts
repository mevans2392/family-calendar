import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, query, orderBy, updateDoc } from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { ToDoItem, FamilyMember } from '../../shared/shared-interfaces';
import { ToDoService } from '../../services/to-do-list.service';
import { FamilyMembersService } from '../../services/family-members.service';



@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrl: './to-do-list.component.css'
})

export class ToDoListComponent {
  private toDoService = inject(ToDoService);
  private familyService = inject(FamilyMembersService);
  private auth = inject(Auth);
  user$ = user(this.auth);

  uid: string = ''
  toDoItems: ToDoItem[] = [];
  familyMembers: FamilyMember[] = [];
  showModal = false;
  newToDoTitle = '';
  selectedUserId: string | null = null;
  editingItem: ToDoItem | null = null;
  private toDoSub: any;

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if (user) {
        this.uid = user.uid;
        this.loadToDo();
        this.loadMembers();
      }
    })
  }

  async loadToDo() {
    if(this.toDoSub) this.toDoSub.unsubscribe();

    const members$ = await this.familyService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;

      this.toDoService.loadToDos().then(stream$ => {
        this.toDoSub = stream$.subscribe(toDoItems => {
          this.toDoItems = toDoItems;
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

  async deleteCompleted() {
    const completedToDos = this.toDoItems.filter(toDoItems => toDoItems.completed);

    if(completedToDos.length === 0) {
      alert('No To Dos to Delete');
      return;
    }

    const confirmDelete = confirm(`Delete ${completedToDos.length} to do items?`);
    if(!confirmDelete) return;

    for(const toDos of completedToDos) {
      if(toDos.id) {
        await this.toDoService.deleteToDo(toDos.id);
      }
    }
  }

  async saveToDo() {
    if(!this.newToDoTitle || !this.selectedUserId) {
      alert("Please enter a title and select a user");
      return;
    }

    const newItem: Partial<ToDoItem> = {
      title: this.newToDoTitle,
      uid: this.selectedUserId
    };

    await this.toDoService.saveTodo(newItem as ToDoItem);
    this.clearForm();
  }

  clearForm() {
    this.newToDoTitle = '';
    this.selectedUserId = null;
    this.editingItem = null;
  }

  editItem(item: ToDoItem) {
    this.editingItem = item;
    this.newToDoTitle = item.title;
    this.selectedUserId = item.uid;
    this.showModal = true;
  }

  async updateToDo() {
    if (!this.editingItem || !this.editingItem.id || !this.newToDoTitle || !this.selectedUserId) {
      alert("Missing Information");
      return;
    }

    const updatedData = {
      title: this.newToDoTitle,
      uid: this.selectedUserId,
    };

    await this.toDoService.saveTodo(updatedData as ToDoItem);
    this.closeModal();
  }

  openModal() {
    this.newToDoTitle = '';
    this.selectedUserId = null;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

}
