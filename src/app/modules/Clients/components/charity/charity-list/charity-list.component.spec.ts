import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharityListComponent } from './charity-list.component';

describe('CharityListComponent', () => {
  let component: CharityListComponent;
  let fixture: ComponentFixture<CharityListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharityListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
