import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberColumnComponent } from './member-column.component';

describe('MemberColumnComponent', () => {
  let component: MemberColumnComponent;
  let fixture: ComponentFixture<MemberColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
