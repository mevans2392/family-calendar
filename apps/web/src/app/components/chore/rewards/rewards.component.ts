import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reward, FamilyMember } from '../../../shared/shared-interfaces';
import { RewardService } from '../../../services/reward.service';
import { FamilyMembersService } from '../../../services/family-members.service';
import { NavComponent } from '../../nav/nav.component';
import { RouterModule } from '@angular/router';
import { RewardModalComponent } from './reward-modal/reward-modal.component';
import { map, Observable } from 'rxjs';
import { CdkDragDrop, CdkDragEnd, CdkDragStart, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, NavComponent, RouterModule, RewardModalComponent, DragDropModule],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent {
  rewards: Reward[] = [];
  members: FamilyMember[] = [];
  filteredMembers: FamilyMember[] = [];
  memberDropIds: string[] = [];

  openModal = false;
  selectedReward: Reward | null = null;

  private rewardService = inject(RewardService);
  private familyService = inject(FamilyMembersService);

  async ngOnInit() {
    await this.loadRewards();
    await this.loadMembers();
  }

  async loadRewards() {
    const reward$ = await this.rewardService.loadRewards();
    reward$.subscribe(data => this.rewards = data);
  }

  async loadMembers() {
    const members$ = await this.familyService.getMembers();
    members$.subscribe(data => {
      this.members = data;
      this.filteredMembers = data.filter(m => m.name != 'Anyone');
      this.memberDropIds = this.filteredMembers.map((_, i) => `memberDrop${i}`);
    })
  }

  async subtractPoints(reward: Reward, member: FamilyMember) {
    const newPoints = (member.points || 0) - reward.points;
    await this.familyService.updatePoints(member.id!, newPoints);
  }

  async handleDrop(event: CdkDragDrop<FamilyMember>) {
    console.log('Drop event:', event);

    const reward = event.item.data as Reward;
    const member = event.container.data as FamilyMember;

    if(reward.points > (member.points || 0)) {
      alert(`${member.name} does not have enough points for this reward`);
      return;
    }

    await this.subtractPoints(reward, member);
    await this.loadMembers();

  }

  isDragging = false;

  onDragStarted() {
    this.isDragging = true;
  }

  onDragEnded(event: CdkDragEnd) {
    setTimeout(() => {
      this.isDragging = false;
    });
  }

  openRewardModal(reward: Reward | null) {
    this.selectedReward = reward;
    this.openModal = true;
  }
}
