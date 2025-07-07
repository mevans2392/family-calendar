import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reward, FamilyMember } from '../../../shared/shared-interfaces';
import { RewardService } from '../../../services/reward.service';
import { FamilyMembersService } from '../../../services/family-members.service';
import { NavComponent } from '../../nav/nav.component';
import { RouterModule } from '@angular/router';
import { RewardModalComponent } from './reward-modal/reward-modal.component';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [CommonModule, NavComponent, RouterModule, RewardModalComponent],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.css'
})
export class RewardsComponent {
  rewards: Reward[] = [];
  members: FamilyMember[] = [];
  filteredMembers: FamilyMember[] = [];

  openModal = false;
  selectedReward: Reward | null = null;

  private rewardService = inject(RewardService);
  private familyService = inject(FamilyMembersService);

  async ngOnInit() {
    const reward$ = await this.rewardService.loadRewards();
    reward$.subscribe(data => this.rewards = data);

    const members$ = await this.familyService.getMembers();
    members$.subscribe(data => {
      this.members = data;
      this.filteredMembers = data.filter(m => m.name !== 'Anyone');
    });

  }

  async subtractPoints(reward: Reward, member: FamilyMember) {
    const newPoints = (member.points || 0) - reward.points;
    await this.familyService.updatePoints(member.id!, newPoints);
  }

  openRewardModal(reward: Reward | null) {
    this.selectedReward = reward;
    this.openModal = true;
  }
}
