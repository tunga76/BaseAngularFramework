import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ButtonComponent } from '../../libs/ui-platform/src/lib/components/button/button.component';
import { ThemeProviderComponent } from '../../libs/ui-platform/src/lib/theme/theme-provider.component';

const meta: Meta = {
    title: 'Platform/Components/Button',
    decorators: [
        moduleMetadata({
            imports: [ButtonComponent, ThemeProviderComponent],
        }),
    ],
    argTypes: {
        variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
        size: { control: 'select', options: ['sm', 'md', 'lg'] },
        disabled: { control: 'boolean' },
        label: { control: 'text' },
    },
};

export default meta;

export const Default: StoryObj = {
    args: {
        label: 'Click Me',
        variant: 'primary',
        size: 'md',
        disabled: false,
        mode: 'light',
    },
    render: (args) => ({
        props: {
            config: { mode: args['mode'] },
            variant: args['variant'],
            size: args['size'],
            disabled: args['disabled'],
            label: args['label']
        },
        template: `
      <platform-theme-provider [config]="config">
        <div style="padding: 40px; background: var(--color-background); min-height: 100vh;">
          <platform-button [variant]="variant" [size]="size" [disabled]="disabled">
            {{ label }}
          </platform-button>
        </div>
      </platform-theme-provider>
    `,
    }),
};

export const Variants: StoryObj = {
    render: () => ({
        template: `
      <div style="display: flex; gap: 12px; padding: 20px;">
        <platform-button variant="primary">Primary</platform-button>
        <platform-button variant="secondary">Secondary</platform-button>
        <platform-button variant="ghost">Ghost</platform-button>
      </div>
    `,
    }),
};
