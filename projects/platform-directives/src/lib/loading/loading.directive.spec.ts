import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoadingDirective } from './loading.directive';

@Component({
    standalone: true,
    imports: [LoadingDirective],
    template: `
    <div id="target" [appLoading]="isLoading">Content</div>
  `,
})
class TestComponent {
    isLoading = false;
}

describe('LoadingDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, LoadingDirective],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should add loading class and overlay when isLoading is true', () => {
        component.isLoading = true;
        fixture.detectChanges();

        const target = fixture.nativeElement.querySelector('#target');
        expect(target.classList.contains('platform-loading')).toBeTrue();
        expect(target.querySelector('.platform-loading-overlay')).toBeTruthy();
    });

    it('should remove loading class and overlay when isLoading is false', () => {
        component.isLoading = true;
        fixture.detectChanges();

        component.isLoading = false;
        fixture.detectChanges();

        const target = fixture.nativeElement.querySelector('#target');
        expect(target.classList.contains('platform-loading')).toBeFalse();
        expect(target.querySelector('.platform-loading-overlay')).toBeFalsy();
    });
});
