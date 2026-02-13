import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UsersStore } from '../../state/users.store';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [ButtonComponent, RouterLink],
    template: `
    <div class="user-detail">
      <div class="header">
        <app-button variant="outline" routerLink="/users">
          &larr; Back to List
        </app-button>
        <h1>User Detail</h1>
      </div>

      @if (store.loading()) {
        <div class="loading">Loading user details...</div>
      }

      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }

      @if (store.selectedUser(); as user) {
        <div class="detail-card">
          <div class="detail-row">
            <span class="label">ID:</span>
            <span class="value">{{ user.id }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Username:</span>
            <span class="value">{{ user.username }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Email:</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Role:</span>
            <span class="value">{{ user.role }}</span>
          </div>
          <div class="detail-row">
            <span class="label">Status:</span>
            <span class="value">
              <span [class]="'badge badge-' + user.status">
                {{ user.status }}
              </span>
            </span>
          </div>
        </div>
      } @else if (!store.loading() && !store.error()) {
        <div class="not-found">User not found.</div>
      }
    </div>
  `,
    styles: [`
    .user-detail { padding: 1.5rem; max-width: 600px; }
    .header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .back-link { color: #666; text-decoration: none; }
    .back-link:hover { color: #007bff; }
    .detail-card { 
      background: white; 
      border: 1px solid #eee; 
      border-radius: 8px; 
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .detail-row { display: flex; padding: 0.75rem 0; border-bottom: 1px solid #f9f9f9; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: 600; width: 120px; color: #555; }
    .value { color: #333; }
    .badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.85rem; }
    .badge-active { background: #d4edda; color: #155724; }
    .badge-inactive { background: #f8d7da; color: #721c24; }
    .not-found { color: #666; font-style: italic; }
  `]
})
export class UserDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    readonly store = inject(UsersStore);

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.store.loadById(id);
        }
    }
}
