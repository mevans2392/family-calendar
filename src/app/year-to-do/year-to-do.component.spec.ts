import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearToDoComponent } from './year-to-do.component';

describe('YearToDoComponent', () => {
  let component: YearToDoComponent;
  let fixture: ComponentFixture<YearToDoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearToDoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearToDoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
