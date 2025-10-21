import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawerDetailsComponent } from './drawer-details.component';
import { TagPayments } from '../tag-payments/tag-payments';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { Tx } from '@core/models/tables.models';
import { CommonModule } from '@angular/common';

describe('DrawerDetailsComponent', () => {
  let component: DrawerDetailsComponent;
  let fixture: ComponentFixture<DrawerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DrawerDetailsComponent,
        TagPayments,
        CommonModule,
        NoopAnimationsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DrawerDetailsComponent);
    component = fixture.componentInstance;

    (component as any).visible = signal(true);
    (component as any).params = signal<Tx>(
       {
        status: 'success',
        date: '2025-10-11T00:00:00.000Z',
        method: {
          brand: 'card',
          franchise: 'VISA',
          last4: '9160'
        },
        boldId: '123ABC',
        amount: 150000,
        salesType: 'PAYMENT_LINK',
        deductions: [
          {
            label: 'Deducción Bold',
            value: 178200.69
          }
        ],
      }
    );

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
