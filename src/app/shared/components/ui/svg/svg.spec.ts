import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Svg } from './svg';

describe('Svg', () => {
  let component: Svg;
  let fixture: ComponentFixture<Svg>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Svg]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Svg);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
