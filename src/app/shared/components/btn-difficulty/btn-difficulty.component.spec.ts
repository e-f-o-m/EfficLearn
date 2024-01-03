import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnDifficultyComponent } from './btn-difficulty.component';

describe('BtnDifficultyComponent', () => {
  let component: BtnDifficultyComponent;
  let fixture: ComponentFixture<BtnDifficultyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BtnDifficultyComponent]
    });
    fixture = TestBed.createComponent(BtnDifficultyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
