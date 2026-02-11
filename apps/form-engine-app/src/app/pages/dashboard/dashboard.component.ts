import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Form Engine Test App</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a routerLink="/kitchen-sink" class="p-4 border rounded hover:bg-gray-50 bg-white shadow block">
          <h3 class="font-bold text-lg text-blue-600">Kitchen Sink</h3>
          <p class="text-gray-600 mt-2">Test all available field types and basic rendering.</p>
        </a>
        
        <a routerLink="/conditional-logic" class="p-4 border rounded hover:bg-gray-50 bg-white shadow block">
          <h3 class="font-bold text-lg text-blue-600">Conditional Logic</h3>
          <p class="text-gray-600 mt-2">Test complex visibility rules and dependencies.</p>
        </a>

        <a routerLink="/validation-test" class="p-4 border rounded hover:bg-gray-50 bg-white shadow block">
          <h3 class="font-bold text-lg text-blue-600">Validation</h3>
          <p class="text-gray-600 mt-2">Test synchronous, asynchronous and custom validators.</p>
        </a>
      </div>
    </div>
  `
})
export class DashboardComponent { }
