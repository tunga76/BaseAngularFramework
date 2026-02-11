import { Component, Input } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: 'app-error',
  standalone: true,
  template: `
    @if (control?.touched && control?.errors) {
      <div class="text-danger">
        {{ getMessage() }}
      </div>
    }
  `
})
export class ErrorComponent {

  @Input() control!: AbstractControl | null;

  getMessage(): string {
    if (!this.control?.errors) return '';

    const errors = this.control.errors;

    if (errors['required']) return 'Bu alan zorunludur';
    if (errors['minlength']) return 'Minimum karakter sağlanmadı';
    if (errors['forbiddenChars']) return 'Geçersiz karakter';
    if (errors['onlyLetters']) return 'Sadece harf girilebilir';

    return 'Geçersiz alan';
  }
}
