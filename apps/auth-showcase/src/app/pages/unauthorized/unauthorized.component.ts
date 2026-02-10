import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent, CardComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-unauthorized',
    standalone: true,
    imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
    template: `
    <div class="container" style="text-align: center; margin-top: 40px;">
      <platform-card [padded]="true">
        <div card-content>
          <h1 style="font-size: 3rem; margin-bottom: 16px;">🚫 403</h1>
          <h2>Access Denied</h2>
          <p style="color: var(--color-text-muted); margin-bottom: 24px;">
            You do not have permission to view this page.
          </p>
          <a routerLink="/">
            <platform-button variant="primary">Go Home</platform-button>
          </a>
        </div>
      </platform-card>
    </div>
  `
})
export class UnauthorizedComponent { }
