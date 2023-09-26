import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBuilderComponent } from './list-builder.component';

describe('ListBuilderComponent', () => {
  let component: ListBuilderComponent;
  let fixture: ComponentFixture<ListBuilderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListBuilderComponent]
    });
    fixture = TestBed.createComponent(ListBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
