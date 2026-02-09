import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiPlatform } from './ui-platform';

describe('UiPlatform', () => {
  let component: UiPlatform;
  let fixture: ComponentFixture<UiPlatform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UiPlatform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UiPlatform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
