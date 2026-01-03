import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnGameComponent } from './btn-game.component';

describe('BtnGameComponent', () => {
  let component: BtnGameComponent;
  let fixture: ComponentFixture<BtnGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BtnGameComponent]
    });
    fixture = TestBed.createComponent(BtnGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
