import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoggerService } from '@platform/core';

@Component({
    selector: 'app-logger-demo',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="demo-container">
      <h2>Logger Service Demo</h2>
      <p class="desc">Check the browser console to see the output of these actions.</p>
      
      <div class="card">
        <h3>Log Levels</h3>
        <div class="button-group">
          <button (click)="logDebug()" class="btn debug">Log Debug</button>
          <button (click)="logInfo()" class="btn info">Log Info</button>
          <button (click)="logWarn()" class="btn warn">Log Warn</button>
          <button (click)="logError()" class="btn error">Log Error</button>
        </div>
      </div>

      <div class="card">
        <h3>Configuration</h3>
        <pre>Min Level: {{ 'debug' }} (See app.config.ts)</pre>
      </div>
    </div>
  `,
    styles: [`
    .demo-container { max-width: 800px; }
    .desc { color: #666; margin-bottom: 24px; }
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    h3 { margin-top: 0; }
    .button-group { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      color: white;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.9; }
    .debug { background-color: #64748b; }
    .info { background-color: #0ea5e9; }
    .warn { background-color: #f59e0b; }
    .error { background-color: #ef4444; }
    pre { background: #f8fafc; padding: 12px; border-radius: 4px; }
  `]
})
export class LoggerDemoComponent {
    private logger = inject(LoggerService);

    logDebug() {
        this.logger.debug('This is a debug message', 'LoggerDemo');
    }

    logInfo() {
        // Fixed: context needs to be string or undefined
        this.logger.info('This is an info message', 'LoggerDemo', { user: 'TestUser' });
    }

    logWarn() {
        this.logger.warn('This is a warning message', undefined, { retryCount: 3 });
    }

    logError() {
        // error(message, error, context)
        this.logger.error('This is an error message', new Error('Something went wrong!'), 'LoggerDemo');
    }
}
