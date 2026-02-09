import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../platform/loading/services/loading.service';
import { GlobalLoadingComponent } from '../../platform/loading/components/global-loading.component';
import { ButtonComponent } from '../../libs/ui-platform/src/lib/components/button/button.component';

const meta: Meta = {
    title: 'Platform/Components/Loading',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, GlobalLoadingComponent, ButtonComponent],
            providers: [LoadingService],
        }),
    ],
};

export default meta;

export const GlobalLoading: StoryObj = {
    render: () => ({
        props: {
            loadingService: null as any // to be injected or used via props
        },
        template: `
      <div style="padding: 40px;">
        <h2>Global Loading System</h2>
        <p>Click the buttons to simulate background processes with a persistent loading indicator.</p>
        
        <div style="display: flex; gap: 12px; margin-top: 20px;">
          <platform-button (onClick)="startLoading()">Trigger Loading (3s)</platform-button>
        </div>

        <platform-global-loading></platform-global-loading>
      </div>
    `,
        moduleMetadata: {
            providers: [LoadingService]
        }
    }),
};

// Simplified renderer for interactivity
export const Interactive: StoryObj = {
    decorators: [
        moduleMetadata({
            imports: [GlobalLoadingComponent, ButtonComponent],
            providers: [LoadingService]
        })
    ],
    render: (args, { loaded }) => ({
        template: `
       <div style="padding: 40px;">
          <platform-button (onClick)="show()">Show Loading</platform-button>
          <platform-button (onClick)="hide()" variant="secondary" style="margin-left: 10px;">Hide Loading</platform-button>
          <platform-global-loading></platform-global-loading>
       </div>
    `,
        props: {
            show: function () {
                (window as any).loadingService?.show();
            },
            hide: function () {
                (window as any).loadingService?.hide();
            }
        }
    })
}
