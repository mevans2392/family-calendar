import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth, user } from '@angular/fire/auth';
import { Chore, FamilyMember } from '../../shared/shared-interfaces';
import { ChoreService } from '../../services/chore.service';
import { FamilyService } from '../../services/family.service';
import { FamilyMembersService } from '../../services/family-members.service';
import { ChoreModalComponent } from '../chore/components/chore-modal/chore-modal.component';

@Component({
  selector: 'app-to-do',
  standalone: true,
  imports: [CommonModule, FormsModule, ChoreModalComponent],
  templateUrl: './to-do.component.html',
  styleUrl: './to-do.component.css'
})
export class ToDoComponent implements OnInit {
  private choreService = inject(ChoreService);
  private familyService = inject(FamilyService);
  private familyMembersService = inject(FamilyMembersService);
  private auth = inject(Auth);
  user$ = user(this.auth);

  userId: string = '';
  toDoItems: Chore[] = [];
  familyMembers: FamilyMember[] = [];
  showModal = false;
  newToDoTitle = '';
  selectedUserId: string | null = null;
  editingItem: Chore | null = null;
  private toDoSub: any;

  ngOnInit(): void {
    this.user$.subscribe((user) => {
      if(user) {
        this.userId = user.uid;
        this.loadToDo();
        this.loadMembers();
      }
    })
  }

  async loadToDo() {
    if(this.toDoSub) this.toDoSub.unsubscribe();

    const members$ = await this.familyMembersService.getMembers();
    members$.subscribe(members => {
      this.familyMembers = members;

      this.choreService.loadChores().then(stream$ => {
        this.toDoSub = stream$.subscribe(toDoItems => {
          this.toDoItems = toDoItems;
        })
      })
    })
  }

  async loadMembers() {
    const members$ = await this.familyMembersService.getMembers();
    members$.subscribe(members => this.familyMembers = members);
  }

  getColorForUid(userId: string): string {
    return this.familyMembers.find(m => m.id === userId)?.color || 'grey';
  }

  async deleteCompleted() {
    const completedToDos = this.toDoItems.filter(toDoItems => toDoItems.complete);

    if(completedToDos.length === 0) {
      alert('No To Dos to Delete');
      return;
    }

    const confirmDelete = confirm(`Delete ${completedToDos.length} to do items?`);
    if(!confirmDelete) return;

    for(const toDos of completedToDos) {
      if(toDos.id) {
        await this.choreService.deleteChore(toDos.id);
      }
    }
  }

  async saveToDo() {
    if(!this.newToDoTitle || !this.selectedUserId) {
      alert("Please enter a title and select a user");
      return;
    }

    const newItem: Partial<Chore> = {
      title: this.newToDoTitle,
      assignedUser: this.selectedUserId
    };

    await this.choreService.saveChore(newItem as Chore);
    this.clearForm();
  }

  clearForm() {
    this.newToDoTitle = '';
    this.selectedUserId = null;
    this.editingItem = null;
  }

  editItem(item: Chore) {
    this.editingItem = item;
    this.newToDoTitle = item.title;
    this.selectedUserId = item.assignedUser!;
    this.showModal = true;
  }

  async updateToDo() {
    if (!this.editingItem || !this.editingItem.id || !this.newToDoTitle || !this.selectedUserId) {
      alert("Missing Information");
      return;
    }

    const updatedData = {
      title: this.newToDoTitle,
      assignedUser: this.selectedUserId,
    };

    await this.choreService.saveChore(updatedData as Chore);
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
