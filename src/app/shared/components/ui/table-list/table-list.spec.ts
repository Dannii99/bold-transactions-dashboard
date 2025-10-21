import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableList } from './table-list';

describe('TableList', () => {
  let component: TableList;
  let fixture: ComponentFixture<TableList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableList],
    }).compileComponents();

    fixture = TestBed.createComponent(TableList);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('cols', 6);
    fixture.componentRef.setInput('body', [
      {
        status: 'success',
        date: '2025-10-11T00:00:00.000Z',
        method: {
          brand: 'card',
          franchise: 'VISA',
          last4: '9160',
        },
        boldId: '123ABC',
        amount: 150000,
        salesType: 'PAYMENT_LINK',
        deductions: [
          {
            label: 'Deducción Bold',
            value: 178200.69,
          },
        ],
      },
    ]);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
