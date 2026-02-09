import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { DashboardLayoutComponent } from '../../libs/ui-platform/src/lib/layouts/dashboard-layout/dashboard-layout.component';
import { ThemeProviderComponent } from '../../libs/ui-platform/src/lib/theme/theme-provider.component';

const meta: Meta = {
    title: 'Platform/Layouts/Dashboard',
    decorators: [
        moduleMetadata({
            imports: [DashboardLayoutComponent, ThemeProviderComponent],
        }),
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;

export const Default: StoryObj = {
    args: {
        mode: 'light',
    },
    render: (args) => ({
        props: {
            config: { mode: args['mode'] }
        },
        template: `
      <platform-theme-provider [config]="config">
        <platform-dashboard-layout>
          <div sidebar-header style="padding: 20px; font-weight: bold; font-size: 1.2rem; color: var(--color-primary);">
            My Platform
          </div>
          
          <div sidebar-nav style="padding: 10px;">
            <div style="padding: 12px; border-radius: 8px; background: rgba(63, 81, 181, 0.1); color: var(--color-primary); margin-bottom: 8px;">Dashboard</div>
            <div style="padding: 12px; border-radius: 8px; color: #666; margin-bottom: 8px;">Users</div>
            <div style="padding: 12px; border-radius: 8px; color: #666; margin-bottom: 8px;">Settings</div>
          </div>
          
          <div top-bar style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <div style="font-weight: 500;">Dashboard / Overview</div>
            <div style="display: flex; gap: 12px; align-items: center;">
               <div style="width: 32px; height: 32px; border-radius: 50%; background: #ddd;"></div>
               <span>Admin User</span>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
             <div style="padding: 24px; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border); box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
               <h3>Total Users</h3>
               <p style="font-size: 2rem; font-weight: bold; color: var(--color-primary);">1,284</p>
             </div>
             <div style="padding: 24px; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border); box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
               <h3>Revenue</h3>
               <p style="font-size: 2rem; font-weight: bold; color: #4caf50;">$42,500</p>
             </div>
             <div style="padding: 24px; background: var(--color-surface); border-radius: 12px; border: 1px solid var(--color-border); box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
               <h3>Active Sessions</h3>
               <p style="font-size: 2rem; font-weight: bold; color: #ff9800;">48</p>
             </div>
          </div>
        </platform-dashboard-layout>
      </platform-theme-provider>
    `,
    }),
};
