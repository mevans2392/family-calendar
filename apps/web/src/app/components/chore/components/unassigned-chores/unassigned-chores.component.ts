import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CdkDragDrop, CdkDragMove, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { Chore } from '../../../../shared/shared-interfaces';
import { ChoreService } from '../../../../services/chore.service';
import { CommonModule } from '@angular/common';
import { ChoreCardComponent } from '../chore-card/chore-card.component';


@Component({
  selector: 'app-unassigned-chores',
  standalone: true,
  imports: [CommonModule, DragDropModule, ChoreCardComponent],
  templateUrl: './unassigned-chores.component.html',
  styleUrl: './unassigned-chores.component.css'
})
export class UnassignedChoresComponent {
  @Input() chores: Chore[] = [];
  @Input() connectedDropLists: string[] = [];
  
  @Output() choreUpdated = new EventEmitter<void>();
  @Output() editChoreRequested = new EventEmitter<Chore>();
  @Output() dragMoved = new EventEmitter<CdkDragMove>();
  @Output() dragEnded = new EventEmitter<void>();

  private choreService = inject(ChoreService);

  async onDrop(event: CdkDragDrop<Chore[]>) {
    try {
      const chore = event.item.data as Chore;

      console.log('Unassigned drop triggered:', chore);

      if (chore.assignedUser !== '') {
        console.log(`Unassigning chore ${chore.id}...`);
        await this.choreService.updateChoreAssignment(chore.id, '');
        console.log(`Chore ${chore.id} successfully unassigned.`);

        this.choreUpdated.emit();
      } else {
        console.log(`Chore ${chore.id} was already unassigned.`);
      }
    } catch (error) {
      console.error('Error during unassigned drop:', error);
    }
  }

  editChore(chore: Chore) {
    this.editChoreRequested.emit(chore);
  }


}
