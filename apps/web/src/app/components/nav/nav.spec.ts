import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainScreenComponent } from './nav.component';

describe('MainScreenComponent', () => {
  let component: MainScreenComponent;
  let fixture: ComponentFixture<MainScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
