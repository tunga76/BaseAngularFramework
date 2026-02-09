import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { SplitViewLayoutComponent } from '../../libs/ui-platform/src/lib/layouts/split-view-layout/split-view-layout.component';
import { ThemeProviderComponent } from '../../libs/ui-platform/src/lib/theme/theme-provider.component';

const meta: Meta = {
    title: 'Platform/Layouts/SplitView',
    decorators: [
        moduleMetadata({
            imports: [SplitViewLayoutComponent, ThemeProviderComponent],
        }),
    ],
    parameters: {
        layout: 'fullscreen',
    },
    argTypes: {
        direction: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    },
};

export default meta;

export const Default: StoryObj = {
    args: {
        direction: 'horizontal',
        mode: 'light',
    },
    render: (args) => ({
        props: {
            config: { mode: args['mode'] },
            direction: args['direction']
        },
        template: `
      <platform-theme-provider [config]="config">
        <platform-split-view-layout [direction]="direction">
          <div left-pane top-pane style="padding: 24px;">
            <h3>Navigation / Tree</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border);">📁 src</li>
              <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); padding-left: 20px;">📁 app</li>
              <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border); padding-left: 20px;">📁 assets</li>
              <li style="padding: 8px 0; border-bottom: 1px solid var(--color-border);">📄 package.json</li>
            </ul>
          </div>
          
          <div right-pane bottom-pane style="padding: 24px;">
            <h3>Editor / Content</h3>
            <div style="background: #fdfdfd; border: 1px solid var(--color-border); padding: 20px; border-radius: 8px; font-family: monospace;">
              <pre>
export class MyComponent {
  title = 'Hello World';
  
  constructor() {
    console.log(this.title);
  }
}
              </pre>
            </div>
            <p style="margin-top: 20px;">Try resizing the panes by dragging the separator!</p>
          </div>
        </platform-split-view-layout>
      </platform-theme-provider>
    `,
    }),
};
