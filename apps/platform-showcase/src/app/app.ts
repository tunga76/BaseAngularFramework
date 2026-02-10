import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'UI Platform Showcase';

  menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/button', label: 'Button', icon: '🔘' },
    { path: '/input', label: 'Input', icon: '📝' },
    { path: '/card', label: 'Card', icon: '📇' },
    { path: '/badge-chip', label: 'Badge & Chip', icon: '🏷️' },
    { path: '/spinner', label: 'Spinner', icon: '⏳' },
    { path: '/modal', label: 'Modal', icon: '📋' },
    { path: '/dropdown', label: 'Dropdown', icon: '📂' },
    { path: '/layouts', label: 'Layouts', icon: '📐' }
  ];
}
