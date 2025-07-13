/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BestShopComponent } from './Best-shop.component';

describe('BestShopComponent', () => {
  let component: BestShopComponent;
  let fixture: ComponentFixture<BestShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestShopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
