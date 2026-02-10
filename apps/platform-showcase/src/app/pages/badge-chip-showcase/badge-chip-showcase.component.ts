import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeComponent, ChipComponent } from '@platform/ui-platform';

@Component({
    selector: 'app-badge-chip-showcase',
    standalone: true,
    imports: [CommonModule, BadgeComponent, ChipComponent],
    template: `
    <div class="showcase-page">
      <div class="page-header">
        <h1 class="page-title">Badge & Chip Components</h1>
        <p class="page-description">Status indicators and removable tags</p>
      </div>

      <div class="section">
        <h2 class="section-title">Badge Variants</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-badge variant="primary">Primary</platform-badge>
            <platform-badge variant="success">Success</platform-badge>
            <platform-badge variant="warning">Warning</platform-badge>
            <platform-badge variant="danger">Danger</platform-badge>
            <platform-badge variant="info">Info</platform-badge>
            <platform-badge variant="neutral">Neutral</platform-badge>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Badge Sizes</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-badge size="sm">Small</platform-badge>
            <platform-badge size="md">Medium</platform-badge>
            <platform-badge size="lg">Large</platform-badge>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Dot Badges</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-badge variant="success" [dot]="true"></platform-badge>
            <platform-badge variant="warning" [dot]="true"></platform-badge>
            <platform-badge variant="danger" [dot]="true"></platform-badge>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Chip Variants</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-chip>Default</platform-chip>
            <platform-chip variant="primary">Primary</platform-chip>
            <platform-chip variant="success">Success</platform-chip>
            <platform-chip variant="warning">Warning</platform-chip>
            <platform-chip variant="danger">Danger</platform-chip>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Removable Chips</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-chip
              *ngFor="let tag of tags"
              [removable]="true"
              (onRemove)="removeTag(tag)">
              {{ tag }}
            </platform-chip>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="section-title">Chips with Avatar</h2>
        <div class="demo-container">
          <div class="demo-row">
            <platform-chip avatar="👤" variant="primary">John Doe</platform-chip>
            <platform-chip avatar="🎨" variant="success">Designer</platform-chip>
            <platform-chip avatar="💻" variant="primary">Developer</platform-chip>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BadgeChipShowcaseComponent {
    tags = ['JavaScript', 'TypeScript', 'Angular', 'React', 'Vue'];

    removeTag(tag: string) {
        this.tags = this.tags.filter(t => t !== tag);
    }
}
