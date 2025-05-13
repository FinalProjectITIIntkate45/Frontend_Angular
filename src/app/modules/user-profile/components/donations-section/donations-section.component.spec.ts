import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DonationsSectionComponent } from './donations-section.component';

describe('DonationsSectionComponent', () => {
  let component: DonationsSectionComponent;
  let fixture: ComponentFixture<DonationsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonationsSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DonationsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
