import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-protected',
    standalone: true,
    imports: [CommonModule, CardComponent],
    template: `
    <div class="container">
      <platform-card [padded]="true">
        <div card-header>
          <h2>🔒 Protected Resource</h2>
        </div>
        <div card-content>
          <p>
            If you can see this page, it means you are <strong>authenticated</strong>!
          </p>
          <p>
            The <code>authGuard</code> allowed you to pass.
          </p>
        </div>
      </platform-card>
    </div>
  `
})
export class ProtectedComponent { }
