import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplecardsComponent } from './multiplecards.component';

describe('MultiplecardsComponent', () => {
  let component: MultiplecardsComponent;
  let fixture: ComponentFixture<MultiplecardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MultiplecardsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiplecardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
