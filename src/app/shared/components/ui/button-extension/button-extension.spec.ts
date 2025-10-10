import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonExtension } from './button-extension';

describe('ButtonExtension', () => {
  let component: ButtonExtension;
  let fixture: ComponentFixture<ButtonExtension>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonExtension]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonExtension);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
