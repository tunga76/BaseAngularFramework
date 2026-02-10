import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-admin',
    standalone: true,
    imports: [CommonModule, CardComponent],
    template: `
    <div class="container">
      <platform-card [padded]="true">
        <div card-header>
          <h2>🛡️ Admin Area</h2>
        </div>
        <div card-content>
          <p>
            Welcome, Administrator!
          </p>
          <p>
            If you see this, you have the required <strong>admin</strong> permission/role.
          </p>
          <p>
            The <code>permissionGuard</code> verified your claims.
          </p>
        </div>
      </platform-card>
    </div>
  `
})
export class AdminComponent { }
