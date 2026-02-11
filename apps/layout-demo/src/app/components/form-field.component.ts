import {
    Component,
    Input,
    computed
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-form-field',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './form-field.component.html'
})
export class FormFieldComponent {

    @Input({ required: true }) form!: FormGroup;
    @Input({ required: true }) controlName!: string;
    @Input() label = '';
    @Input() type: 'text' | 'number' | 'select' = 'text';
    @Input() readonly = false;
    @Input() compareTo?: string;
    @Input() options?: { label: string; value: any }[];

    get control(): AbstractControl | null {
        return this.form.get(this.controlName);
    }

    get compareMismatch(): boolean {
        if (!this.compareTo) return false;

        const value1 = this.form.get(this.controlName)?.value;
        const value2 = this.form.get(this.compareTo)?.value;

        return value1 && value2 && value1 !== value2;
    }

    get isInvalid(): boolean {
        return !!(this.control?.invalid && this.control?.touched);
    }

    get isValid(): boolean {
        return !!(this.control?.valid && this.control?.touched);
    }

    get errorMessage(): string {
        if (!this.control?.errors) return '';

        const errors = this.control.errors;

        if (errors['required']) return 'Bu alan zorunludur';
        if (errors['minlength']) return 'Minimum karakter sağlanmadı';
        if (errors['forbiddenChars']) return 'Geçersiz karakter';
        if (errors['onlyLetters']) return 'Sadece harf girilebilir';

        return 'Geçersiz alan';
    }
}
