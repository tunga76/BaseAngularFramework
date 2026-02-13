import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  template: `
    <button 
      [type]="type()" 
      [disabled]="disabled()" 
      [class]="'btn btn-' + variant()"
      (click)="clicked.emit($event)">
      <slot></slot>
      <ng-content></ng-content>
    </button>
  `,
  styles: [`
    .btn {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      border: none;
      transition: opacity 0.2s;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-primary { background-color: #007bff; color: white; }
    .btn-secondary { background-color: #6c757d; color: white; }
    .btn-outline { background-color: transparent; border: 1px solid #ccc; }
  `]
})
export class ButtonComponent {
  type = input<'button' | 'submit' | 'reset'>('button');
  variant = input<'primary' | 'secondary' | 'outline'>('primary');
  disabled = input<boolean>(false);
  clicked = output<MouseEvent>();
}
