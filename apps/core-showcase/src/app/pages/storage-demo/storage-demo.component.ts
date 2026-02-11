import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '@platform/core';

@Component({
    selector: 'app-storage-demo',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="demo-container">
      <h2>Storage Service Demo</h2>
      <p class="desc">Test secure local and session storage operations.</p>
      <p class="info-note">ℹ️ Note: Storage is encrypted by default via <code>provideCore</code>.</p>
      
      <div class="card">
        <h3>Set Item</h3>
        <div class="form-group">
          <label>Key:</label>
          <input [(ngModel)]="key" placeholder="Enter key">
        </div>
        <div class="form-group">
          <label>Value (JSON supported):</label>
          <input [(ngModel)]="value" placeholder="Enter value">
        </div>
        <div class="options">
          <label><input type="checkbox" [(ngModel)]="isSession"> Session Storage (Note: Demo uses injected service which defaults to Local via provideCore)</label>
        </div>
        <p class="text-xs text-muted">The injected <code>STORAGE_SERVICE</code> is configured as Encrypted LocalStorage. Session storage switching is not supported by the single token injection pattern in this demo without separate tokens.</p>
        <button (click)="setItem()" class="btn primary">Set Item</button>
      </div>

      <div class="card">
        <h3>Get / Remove Item</h3>
        <div class="form-group">
          <label>Key to Retrieve/Remove:</label>
          <input [(ngModel)]="searchKey" placeholder="Enter key">
        </div>
        <div class="button-group">
          <button (click)="getItem()" class="btn info">Get Item</button>
          <button (click)="removeItem()" class="btn warn">Remove Item</button>
          <button (click)="clear()" class="btn error">Clear All</button>
        </div>
      </div>

      <div class="card result-card" *ngIf="lastResult()">
        <h3>Operation Result</h3>
        <pre>{{ lastResult() | json }}</pre>
      </div>
      
      <div class="card">
        <h3>Keys in LocalStorage</h3>
         <div class="button-group">
            <button (click)="refreshKeys()" class="btn secondary">Refresh Keys</button>
         </div>
         <ul>
           <li *ngFor="let k of storedKeys">{{ k }}</li>
         </ul>
      </div>
    </div>
  `,
    styles: [`
    .demo-container { max-width: 800px; }
    .desc { color: #666; margin-bottom: 12px; }
    .info-note { background: #e0f2fe; padding: 8px; border-radius: 4px; color: #0369a1; margin-bottom: 24px; }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    .form-group { margin-bottom: 12px; }
    label { display: block; margin-bottom: 4px; font-weight: 500; }
    input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .options { display: flex; gap: 16px; margin-bottom: 16px; }
    .options label { display: flex; align-items: center; gap: 6px; font-weight: normal; }
    input[type="checkbox"] { width: auto; }
    .button-group { display: flex; gap: 12px; }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      color: white;
      font-weight: 500;
    }
    .primary { background: #3b82f6; }
    .info { background: #0ea5e9; }
    .warn { background: #f59e0b; }
    .error { background: #ef4444; }
    .secondary { background: #64748b; }
    .text-xs { font-size: 0.8rem; }
    .text-muted { color: #64748b; }
    pre { background: #f8fafc; padding: 12px; overflow: auto; border-radius: 4px; }
  `]
})
export class StorageDemoComponent {
    private storage = inject(StorageService);

    key = '';
    value = '';
    searchKey = '';
    isSession = false; // Not effectively used as service is fixed injection
    lastResult = signal<any>(null);
    storedKeys: string[] = [];

    setItem() {
        try {
            // Try parsing as JSON if it looks like object
            let valToStore: any = this.value;
            if (this.value.trim().startsWith('{') || this.value.trim().startsWith('[')) {
                try { valToStore = JSON.parse(this.value); } catch { }
            }

            // Note: Encryption is automatic via provideCore
            this.storage.setItem(this.key, typeof valToStore === 'string' ? valToStore : JSON.stringify(valToStore));

            this.lastResult.set({ success: true, action: 'Set', key: this.key });
            this.refreshKeys();
        } catch (err: any) {
            this.lastResult.set({ success: false, error: err.message });
        }
    }

    getItem() {
        const val = this.storage.getItem(this.searchKey);
        let parsed = val;
        try { parsed = JSON.parse(val!); } catch { }
        this.lastResult.set({ action: 'Get', key: this.searchKey, value: val, parsed });
    }

    removeItem() {
        this.storage.removeItem(this.searchKey);
        this.lastResult.set({ success: true, action: 'Remove', key: this.searchKey });
        this.refreshKeys();
    }

    clear() {
        this.storage.clear();
        this.lastResult.set({ success: true, action: 'Clear All' });
        this.refreshKeys();
    }

    refreshKeys() {
        // Simple way to show keys (only works because we are in browser)
        this.storedKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            this.storedKeys.push('Local: ' + localStorage.key(i));
        }
    }
}
