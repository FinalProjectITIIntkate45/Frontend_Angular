import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecyclingSectionComponent } from './recycling-section.component';

describe('RecyclingSectionComponent', () => {
  let component: RecyclingSectionComponent;
  let fixture: ComponentFixture<RecyclingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecyclingSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecyclingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
