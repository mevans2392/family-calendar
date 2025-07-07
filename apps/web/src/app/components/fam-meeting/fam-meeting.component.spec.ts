import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamMeetingComponent } from './fam-meeting.component';

describe('FamMeetingComponent', () => {
  let component: FamMeetingComponent;
  let fixture: ComponentFixture<FamMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamMeetingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
