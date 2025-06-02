import { TestBed } from '@angular/core/testing';

import { FamilyMembersService } from './family-members.service';

describe('FamilyMembersService', () => {
  let service: FamilyMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FamilyMembersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
