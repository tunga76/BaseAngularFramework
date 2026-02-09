import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ThemeProviderComponent } from '../libs/ui-platform/src/lib/theme/theme-provider.component';

const meta: Meta = {
    title: 'Platform/Design Tokens',
    decorators: [
        moduleMetadata({
            imports: [ThemeProviderComponent],
        }),
    ],
    argTypes: {
        primaryColor: { control: 'color' },
        borderRadius: { control: { type: 'range', min: 0, max: 32, step: 2 }, suffix: 'px' },
        fontScale: { control: { type: 'range', min: 12, max: 24, step: 1 }, suffix: 'px' },
        mode: { control: 'inline-radio', options: ['light', 'dark'] },
    },
};

export default meta;

export const Playground: StoryObj = {
    args: {
        primaryColor: '#3f51b5',
        borderRadius: 8,
        fontScale: 16,
        mode: 'light',
    },
    render: (args) => ({
        props: {
            config: {
                primaryColor: args['primaryColor'],
                borderRadius: args['borderRadius'] + 'px',
                fontScale: args['fontScale'] + 'px',
                mode: args['mode'],
            },
        },
        template: `
      <platform-theme-provider [config]="config">
        <div style="padding: 24px; background: var(--color-background); color: var(--color-text); min-height: 200px; border: 1px solid var(--color-border); border-radius: var(--radius-md);">
          <h2 style="color: var(--color-primary);">Design Token Playground</h2>
          <p>This area responds to the controls above in real-time.</p>
          
          <div style="display: flex; gap: 12px; margin-top: 20px;">
            <button style="padding: 10px 20px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); cursor: pointer;">
              Primary Button
            </button>
            <div style="padding: 10px 20px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface);">
              Surface Element
            </div>
          </div>
          
          <div style="margin-top: 20px;">
            <span style="font-size: var(--font-size-sm);">Small Text</span> | 
            <span style="font-size: var(--font-size-md);">Medium Text</span> | 
            <span style="font-size: var(--font-size-lg);">Large Text</span>
          </div>
        </div>
      </platform-theme-provider>
    `,
    }),
};
