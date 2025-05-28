import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowSellerComponent } from './follow-seller.component';

describe('FollowSellerComponent', () => {
  let component: FollowSellerComponent;
  let fixture: ComponentFixture<FollowSellerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowSellerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowSellerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
