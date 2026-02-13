import { Component, inject, OnInit } from '@angular/core';
import { UsersStore } from '../../state/users.store';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  template: `
    <div class="user-list">
      <h1>User Management</h1>
      <p>Active Users: {{ store.activeUsersCount() }} / {{ store.totalUsersCount() }}</p>
      
      @if (store.loading()) {
        <div class="loading-spinner">Loading users...</div>
      }

      @if (store.error()) {
        <div class="error-banner">{{ store.error() }}</div>
      }
      
      <table class="enterprise-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          @for (user of store.users(); track user.id) {
            <tr>
              <td>
                <a [routerLink]="['/users', user.id]" class="user-link">
                  {{ user.username }}
                </a>
              </td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <span [class]="'badge badge-' + user.status">
                  {{ user.status }}
                </span>
              </td>
            </tr>
          } @empty {
            <tr>
              <td colspan="4" class="empty-state">No users found.</td>
            </tr>
          }
        </tbody>
      </table>

      <div class="actions">
        <app-button (clicked)="store.loadAll()">Refresh Users</app-button>
      </div>
    </div>
  `,
  styles: [`
    .user-list { padding: 1rem; }
    .enterprise-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    .enterprise-table th, .enterprise-table td { padding: 0.75rem; border-bottom: 1px solid #eee; text-align: left; }
    .badge { padding: 0.25rem 0.5rem; border-radius: 12px; font-size: 0.8rem; text-transform: capitalize; }
    .badge-active { background: #d4edda; color: #155724; }
    .badge-inactive { background: #f8d7da; color: #721c24; }
    .actions { margin-top: 1.5rem; }
    .empty-state { text-align: center; color: #666; font-style: italic; }
    .user-link { color: #007bff; text-decoration: none; font-weight: 500; }
    .user-link:hover { text-decoration: underline; }
  `]
})
export class UserListComponent implements OnInit {
  readonly store = inject(UsersStore);

  ngOnInit(): void {
    this.store.loadAll();
  }
}
