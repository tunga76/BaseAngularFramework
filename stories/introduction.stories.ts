import type { Meta, StoryObj } from '@storybook/angular';

const meta: Meta = {
    title: 'Platform/Introduction',
};

export default meta;

export const Welcome: StoryObj = {
    render: () => ({
        template: `
      <div style="padding: 40px; font-family: sans-serif; max-width: 800px; line-height: 1.6;">
        <h1 style="color: #3f51b5; font-size: 3rem; margin-bottom: 24px;">🚀 UI Platform</h1>
        <p style="font-size: 1.2rem; color: #666;">
          Welcome to the Enterprise UI Platform documentation and playground.
          This platform provides a complete set of layouts, components, and tools to build consistent,
          high-quality Angular applications.
        </p>
        
        <div style="margin-top: 40px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
          <div style="padding: 24px; border: 1px solid #eee; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0;">🏗️ Layout Engine</h3>
            <p>Responsive, themeable layouts like Dashboard, FullScreen, and SplitView.</p>
          </div>
          <div style="padding: 24px; border: 1px solid #eee; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0;">🎨 Theme System</h3>
            <p>Design token based tokens, runtime switching, and deep dark mode support.</p>
          </div>
          <div style="padding: 24px; border: 1px solid #eee; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0;">🛠️ Shared Services</h3>
            <p>Unified Popup, Loading, and HTTP services with consistent behavior.</p>
          </div>
          <div style="padding: 24px; border: 1px solid #eee; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <h3 style="margin-top: 0;">📚 Documentation</h3>
            <p>Auto-generated docs with live examples and playground.</p>
          </div>
        </div>
      </div>
    `,
    }),
};
