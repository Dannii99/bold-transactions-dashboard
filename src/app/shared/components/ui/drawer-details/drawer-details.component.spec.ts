import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerDetailsComponent } from './drawer-details.component';

describe('DrawerDetailsComponent', () => {
  let component: DrawerDetailsComponent;
  let fixture: ComponentFixture<DrawerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
