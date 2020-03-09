import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErcCoinSaleComponent } from './erc-coin-sale.component';

describe('ErcCoinSaleComponent', () => {
  let component: ErcCoinSaleComponent;
  let fixture: ComponentFixture<ErcCoinSaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErcCoinSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErcCoinSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
