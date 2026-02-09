import { Component, signal } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HasPermissionDirective } from './has-permission.directive';
import { AuthStore } from './auth.store';

@Component({
    standalone: true,
    imports: [HasPermissionDirective],
    template: `
    @if (true) {
      <button id="test-btn" *appHasPermission="'USER_CREATE'">Create</button>
    }
  `,
})
class TestComponent { }

describe('HasPermissionDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let authStore: AuthStore;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, HasPermissionDirective],
            providers: [AuthStore],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        authStore = TestBed.inject(AuthStore);
    });

    it('should show element when user has permission', () => {
        authStore.updateState({ permissions: ['USER_CREATE'] });
        fixture.detectChanges();
        const btn = fixture.nativeElement.querySelector('#test-btn');
        expect(btn).toBeTruthy();
    });

    it('should hide element when user does not have permission', () => {
        authStore.updateState({ permissions: ['OTHER_PERM'] });
        fixture.detectChanges();
        const btn = fixture.nativeElement.querySelector('#test-btn');
        expect(btn).toBeFalsy();
    });

    it('should react to permission changes', () => {
        authStore.updateState({ permissions: [] });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#test-btn')).toBeFalsy();

        authStore.updateState({ permissions: ['USER_CREATE'] });
        fixture.detectChanges();
        expect(fixture.nativeElement.querySelector('#test-btn')).toBeTruthy();
    });
});
