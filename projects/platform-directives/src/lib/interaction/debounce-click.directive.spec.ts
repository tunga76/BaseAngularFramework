import { Component } from '@angular/core';
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebounceClickDirective } from './debounce-click.directive';

@Component({
    standalone: true,
    imports: [DebounceClickDirective],
    template: `
    <button id="debounce-btn" appDebounceClick [debounceTime]="500" (debouncedClick)="onClick()">
      Click Me
    </button>
  `,
})
class TestComponent {
    clicked = false;
    onClick() {
        this.clicked = true;
    }
}

describe('DebounceClickDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, DebounceClickDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should debounce click events', fakeAsync(() => {
        const btn = fixture.nativeElement.querySelector('#debounce-btn');

        btn.click();
        btn.click();
        btn.click();

        expect(component.clicked).toBeFalse();

        tick(500);
        expect(component.clicked).toBeTrue();
    }));
});
