import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPayments } from './tag-payments';

describe('TagPayments', () => {
  let component: TagPayments;
  let fixture: ComponentFixture<TagPayments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagPayments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagPayments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
