import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPayments } from './tag-payments';
import { signal } from '@angular/core';
import { Method } from '@core/models/tables.models';

describe('TagPayments', () => {
  let component: TagPayments;
  let fixture: ComponentFixture<TagPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagPayments);
    fixture.componentRef.setInput('method', {
      brand: 'card',
      franchise: 'VISA',
      last4: '7941'
    });

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
