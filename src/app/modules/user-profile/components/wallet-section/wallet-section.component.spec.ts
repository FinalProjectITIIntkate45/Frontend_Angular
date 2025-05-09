import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSectionComponent } from './wallet-section.component';

describe('WalletSectionComponent', () => {
  let component: WalletSectionComponent;
  let fixture: ComponentFixture<WalletSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletSectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
