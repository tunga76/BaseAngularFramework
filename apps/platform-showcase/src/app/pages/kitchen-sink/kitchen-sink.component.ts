import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import {
    ButtonComponent,
    InputComponent,
    CardComponent,
    BadgeComponent,
    SpinnerComponent,
    AlertComponent,
    TableComponent,
    ModalComponent,
    FormFieldComponent,
    ToastService,
    ToastContainerComponent,
    ConfirmDialogService,
    ConfirmDialogComponent,
    ValidationDirective,
    ErrorMessagePipe,
    GlobalLoadingService
} from '@platform/ui-platform';

@Component({
    selector: 'app-kitchen-sink',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonComponent,
        InputComponent,
        CardComponent,
        BadgeComponent,
        SpinnerComponent,
        AlertComponent,
        TableComponent,
        ModalComponent,
        FormFieldComponent,
        ToastContainerComponent,
        ConfirmDialogComponent,
        ValidationDirective,
        ErrorMessagePipe
    ],
    template: `
    <platform-toast-container></platform-toast-container>
    <platform-confirm-dialog></platform-confirm-dialog>

    <div class="p-4 flex flex-col gap-4">
      <h1 class="text-3xl font-bold mb-4">UI Framework Kitchen Sink</h1>

      <!-- Buttons -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Buttons</h2>
        <div class="flex gap-2 flex-wrap items-center">
          <platform-button variant="primary">Primary</platform-button>
          <platform-button variant="secondary">Secondary</platform-button>
          <platform-button variant="outline">Outline</platform-button>
          <platform-button variant="ghost">Ghost</platform-button>
          <platform-button variant="danger">Danger</platform-button>
          <platform-button variant="primary" [loading]="true">Loading</platform-button>
          <platform-button variant="primary" [disabled]="true">Disabled</platform-button>
          <platform-button variant="primary" size="sm">Small</platform-button>
          <platform-button variant="primary" size="lg">Large</platform-button>
        </div>
      </section>

      <!-- Spinner -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Spinner</h2>
        <div class="flex gap-4">
          <platform-spinner size="sm"></platform-spinner>
          <platform-spinner size="md"></platform-spinner>
          <platform-spinner size="lg"></platform-spinner>
          <platform-spinner variant="dots"></platform-spinner>
          <platform-spinner variant="pulse"></platform-spinner>
        </div>
      </section>

      <!-- Badges -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Badges</h2>
        <div class="flex gap-2">
          <platform-badge variant="primary">Primary</platform-badge>
          <platform-badge variant="secondary">Secondary</platform-badge>
          <platform-badge variant="outline">Outline</platform-badge>
          <platform-badge variant="danger">Danger</platform-badge>
        </div>
      </section>

      <!-- Alerts -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Alerts</h2>
        <div class="flex flex-col gap-2">
          <platform-alert variant="primary" title="Info">This is an info alert.</platform-alert>
          <platform-alert variant="secondary" title="Success">Operation successful!</platform-alert>
          <platform-alert variant="outline" title="Warning">Proceed with caution.</platform-alert>
          <platform-alert variant="danger" title="Error">Something went wrong.</platform-alert>
        </div>
      </section>

      <!-- Inputs & Forms -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Inputs & Forms</h2>
        <div class="grid grid-cols-2 gap-4 max-w-2xl">
           <platform-form-field label="Username" hint="Enter your unique username" [required]="true">
             <platform-input [formControl]="usernameControl" placeholder="johndoe"></platform-input>
           </platform-form-field>

           <platform-form-field label="Email" errorMessage="Invalid email address">
             <platform-input type="email" placeholder="john@example.com" prefixIcon="mail"></platform-input>
           </platform-form-field>
           
           <platform-form-field label="Disabled Input">
             <platform-input value="Locked" [disabled]="true"></platform-input>
           </platform-form-field>

           <!-- Validation Directive Example -->
           <div class="flex flex-col gap-1">
             <label class="text-sm font-medium">Native Input with Validation Directive</label>
             <input type="text" 
                    [formControl]="usernameControl" 
                    platformValidation 
                    class="border p-2 rounded" 
                    [class.border-red-500]="usernameControl.invalid && usernameControl.touched">
             <span *ngIf="usernameControl.invalid && usernameControl.touched" class="text-red-500 text-xs">
               {{ usernameControl.errors | errorMessage }}
             </span>
           </div>
        </div>
        <div class="mt-2">
           <p>Username value: {{ usernameControl.value }}</p>
           <p>Username valid: {{ usernameControl.valid }}</p>
           <platform-button (onClick)="usernameControl.markAsTouched()">Mark Touched</platform-button>
        </div>
      </section>

      <!-- Cards -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Cards</h2>
        <div class="grid grid-cols-3 gap-4">
          <platform-card variant="elevated" [hoverable]="true">
            <h3 card-header>Elevated Card</h3>
            <p>This is an elevated card content.</p>
            <div card-footer>
              <platform-button size="sm">Action</platform-button>
            </div>
          </platform-card>
          
          <platform-card variant="outlined">
            <h3 card-header>Outlined Card</h3>
            <p>This is an outlined card content.</p>
          </platform-card>

          <platform-card variant="flat">
            <p>Flat card without header/footer.</p>
          </platform-card>
        </div>
      </section>

      <!-- Table -->
      <section>
        <h2 class="text-xl font-semibold mb-2">Table</h2>
        <platform-table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>Developer</td>
              <td><platform-badge variant="secondary">Active</platform-badge></td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>Designer</td>
              <td><platform-badge variant="outline">Offline</platform-badge></td>
            </tr>
          </tbody>
        </platform-table>
      </section>

      <!-- UX Services -->
      <section>
        <h2 class="text-xl font-semibold mb-2">UX Services</h2>
        <div class="flex gap-2">
          <platform-button (onClick)="showToast()">Show Toast</platform-button>
          <platform-button (onClick)="openConfirm()">Open Confirm</platform-button>
          <platform-button (onClick)="toggleLoading()">Toggle Global Loading</platform-button>
          <platform-button (onClick)="openModal()">Open Modal</platform-button>
        </div>
      </section>
      
      <!-- Modal -->
      <platform-modal [open]="isModalOpen" title="Demo Modal" (onClose)="isModalOpen = false">
        <p>This is a native dialog modal.</p>
        <div modal-footer>
          <platform-button variant="ghost" (onClick)="isModalOpen = false">Cancel</platform-button>
          <platform-button (onClick)="isModalOpen = false">OK</platform-button>
        </div>
      </platform-modal>
    </div>
  `
})
export class KitchenSinkComponent {
    toastService = inject(ToastService);
    confirmService = inject(ConfirmDialogService);
    loadingService = inject(GlobalLoadingService);

    usernameControl = new FormControl('', [Validators.required, Validators.minLength(3)]);

    isModalOpen = false;

    showToast() {
        this.toastService.show('Action completed successfully!', 'success');
    }

    async openConfirm() {
        const confirmed = await this.confirmService.confirm({
            title: 'Delete Item?',
            message: 'Are you sure you want to delete this item? This action cannot be undone.',
            confirmText: 'Delete',
            cancelText: 'Cancel'
        });

        if (confirmed) {
            this.toastService.show('Item deleted', 'error');
        } else {
            this.toastService.show('Cancelled', 'info');
        }
    }

    toggleLoading() {
        this.loadingService.show();
        setTimeout(() => {
            this.loadingService.hide();
        }, 2000);
    }

    openModal() {
        this.isModalOpen = true;
    }
}
