import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListResourcesComponent } from './list-resources.component';

describe('ListResourcesComponent', () => {
  let component: ListResourcesComponent;
  let fixture: ComponentFixture<ListResourcesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListResourcesComponent]
    });
    fixture = TestBed.createComponent(ListResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
