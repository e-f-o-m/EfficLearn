import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnImgComponent } from './btn-img.component';

describe('BtnImgComponent', () => {
  let component: BtnImgComponent;
  let fixture: ComponentFixture<BtnImgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BtnImgComponent]
    });
    fixture = TestBed.createComponent(BtnImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
