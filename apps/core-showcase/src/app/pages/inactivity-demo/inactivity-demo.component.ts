import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InactivityService, CORE_CONFIG } from '@platform/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-inactivity-demo',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="demo-container">
      <h2>Inactivity Service Demo</h2>
      <p class="desc">
        Configured Timeout: {{ config.inactivity?.idleTimeoutMs! / 1000 }}s <br>
        Warning Before: {{ config.inactivity?.warningBeforeMs! / 1000 }}s
      </p>
      
      <div class="card status-card" [class.warning]="isWarning()">
        <h3>Status: {{ status() }}</h3>
        <p *ngIf="isWarning()">⚠️ User is inactive! Timeout imminent.</p>
        <p *ngIf="status() === 'Timed Out'">🔒 Session Timed Out!</p>
      </div>

      <div class="card">
        <h3>Event Log</h3>
        <div class="log-container">
          <div *ngFor="let log of logs" class="log-item">
            <span class="time">{{ log.time }}</span>
            <span class="msg">{{ log.message }}</span>
          </div>
        </div>
      </div>
      
      <button (click)="reset()" class="btn primary">Reset Timer</button>
    </div>
  `,
    styles: [`
    .demo-container { max-width: 800px; }
    .desc { color: #666; margin-bottom: 24px; line-height: 1.5; }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background: white;
      transition: all 0.3s;
    }
    .status-card { border-left: 5px solid #22c55e; }
    .status-card.warning { 
      border-left-color: #f59e0b; 
      background-color: #fffbeb;
    }
    .log-container {
      background: #1e293b;
      color: #e2e8f0;
      padding: 12px;
      border-radius: 4px;
      height: 200px;
      overflow-y: auto;
      font-family: monospace;
      font-size: 0.9rem;
    }
    .log-item { margin-bottom: 4px; border-bottom: 1px solid #334155; padding-bottom: 2px; }
    .time { color: #94a3b8; margin-right: 12px; }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      color: white;
      font-weight: 500;
      background: #3b82f6;
    }
  `]
})
export class InactivityDemoComponent implements OnInit, OnDestroy {
    inactivity = inject(InactivityService);
    config = inject(CORE_CONFIG);

    status = signal('Active');
    isWarning = signal(false);
    logs: { time: string, message: string }[] = [];

    private subs = new Subscription();

    ngOnInit() {
        this.addLog('Demo started. Listening for inactivity...');

        // Subscribe to warning event
        this.subs.add(this.inactivity.warning$.subscribe(isWarn => {
            this.isWarning.set(isWarn);
            if (isWarn) {
                this.status.set('Warning');
                this.addLog('Warning: Inactivity detected!');
            } else {
                if (this.status() !== 'Timed Out') {
                    this.status.set('Active');
                    // Don't log every reset to avoid noise, only log transitions implies activity
                }
            }
        }));

        // Subscribe to timeout event
        this.subs.add(this.inactivity.timeout$.subscribe(() => {
            this.status.set('Timed Out');
            this.isWarning.set(false);
            this.addLog('CRITICAL: Idle Timeout Reached!');
            alert('Session Timed Out (Simulated)');
        }));
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

    reset() {
        this.inactivity.reset();
        this.status.set('Active');
        this.isWarning.set(false);
        this.addLog('Manual Reset triggered.');
    }

    private addLog(message: string) {
        const time = new Date().toLocaleTimeString();
        this.logs.unshift({ time, message });
    }
}
