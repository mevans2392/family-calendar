import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, CdkDragMove, DragDropModule, transferArrayItem } from '@angular/cdk/drag-drop';
import { Chore, FamilyMember } from '../../../../shared/shared-interfaces';
import { ChoreService } from '../../../../services/chore.service';
import { ChoreCardComponent } from '../chore-card/chore-card.component';

@Component({
  selector: 'app-member-column',
  standalone: true,
  imports: [CommonModule, DragDropModule, ChoreCardComponent],
  templateUrl: './member-column.component.html',
  styleUrl: './member-column.component.css'
})
export class MemberColumnComponent {
  @Input() member!: FamilyMember;
  @Input() chores: Chore[] = [];
  @Input() connectedDropLists: string[] = [];

  @Output() choreUpdated = new EventEmitter<void>();
  @Output() editChoreRequested = new EventEmitter<Chore>();
  @Output() dragMoved = new EventEmitter<CdkDragMove>();
  @Output() dragEnded = new EventEmitter<void>();
  

  private choreService = inject(ChoreService);

  async onDrop(event: CdkDragDrop<Chore[]>) {
    const chore: Chore = event.item.data;

    // Only act if assignment is changing
    if (chore.assignedUser !== this.member.id) {
      try {
        console.log(`Updating chore ${chore.id} to user ${this.member.id}`);
        await this.choreService.updateChoreAssignment(chore.id!, this.member.id);
        this.choreUpdated.emit();

        // Update UI instantly if arrays are in memory
        if (event.previousContainer !== event.container) {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        }

        // Update the local object's value so it matches UI
        chore.assignedUser = this.member.id;
      } catch (error) {
        console.error('Failed to update assignment:', error);
      }
    }
  }

  editChore(chore: Chore) {
    this.editChoreRequested.emit(chore);
  }
}
