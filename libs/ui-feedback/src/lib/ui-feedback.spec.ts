import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiFeedback } from './ui-feedback';

describe('UiFeedback', () => {
  let component: UiFeedback;
  let fixture: ComponentFixture<UiFeedback>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiFeedback]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiFeedback);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
