import { Component } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TrimDirective } from './trim.directive';

@Component({
    standalone: true,
    imports: [TrimDirective, ReactiveFormsModule],
    template: `
    <input type="text" appTrim [formControl]="control">
  `,
})
class TestComponent {
    control = new FormControl('');
}

describe('TrimDirective', () => {
    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TestComponent, TrimDirective, ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should trim value on blur', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '  hello world  ';
        input.dispatchEvent(new Event('input'));
        input.dispatchEvent(new Event('blur'));

        expect(component.control.value).toBe('hello world');
        expect(input.value).toBe('hello world');
    });
});
