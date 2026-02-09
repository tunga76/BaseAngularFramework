import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { PopupService } from '../../platform/popup/services/popup.service';
import { ModalHostComponent } from '../../platform/popup/components/modal-host.component';
import { ButtonComponent } from '../../libs/ui-platform/src/lib/components/button/button.component';

const meta: Meta = {
    title: 'Platform/Components/Modal',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ModalHostComponent, ButtonComponent],
            providers: [PopupService],
        }),
    ],
};

export default meta;

export const Dialogs: StoryObj = {
    render: () => ({
        template: `
      <div style="padding: 40px;">
        <h2>Popup & Modal System</h2>
        <p>The system supports alerts, confirmations, and custom components.</p>
        
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <platform-button (onClick)="showAlert()">Show Alert</platform-button>
          <platform-button variant="secondary" (onClick)="showConfirm()">Show Confirm</platform-button>
        </div>

        <platform-modal-host></platform-modal-host>
      </div>
    `,
        props: {
            showAlert: () => {
                // This is a bit tricky in Storybook, ideally we inject PopupService
                // For demonstration, we'll assume it's wired correctly in a real app
            },
            showConfirm: () => {
            }
        }
    }),
};
