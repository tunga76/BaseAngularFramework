import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent, ButtonComponent, BadgeComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-card-showcase',
    standalone: true,
    imports: [CommonModule, CardComponent, ButtonComponent, BadgeComponent],
    template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Card Component</h1>
        <p class="page-description">Flexible container with header, content, and footer slots</p>
      </div>

      <div class="section">
        <h2 class="section-title">Basic Card</h2>
        <div class="demo-container">
          <platform-card style="max-width: 400px">
            <div card-header>
              <h3>Card Title</h3>
            </div>
            <div card-content>
              <p>This is the card content. You can put any content here.</p>
            </div>
            <div card-footer>
              <platform-button size="sm">Action</platform-button>
            </div>
          </platform-card>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Hoverable Cards</h2>
        <div class="demo-grid">
          <platform-card [hoverable]="true">
            <div card-content>
              <h4>Product 1</h4>
              <p>Hover over me!</p>
              <platform-badge variant="success">In Stock</platform-badge>
            </div>
          </platform-card>

          <platform-card [hoverable]="true">
            <div card-content>
              <h4>Product 2</h4>
              <p>Click to learn more</p>
              <platform-badge variant="warning">Limited</platform-badge>
            </div>
          </platform-card>
        </div>
      </div>
    </div>
  `
})
export class CardShowcaseComponent { }
