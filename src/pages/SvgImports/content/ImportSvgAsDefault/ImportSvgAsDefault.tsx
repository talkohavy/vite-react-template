// @ts-ignore
// oxlint-disable-next-line @typescript-eslint/no-unused-vars
import ViteIconComponent from '../../../../assets/vite2.svg';
import CodeBlock from '../../../../components/CodeBlock';

export default function ImportSvgAsDefault() {
  return (
    <section className='border border-gray-300 dark:border-gray-700 rounded-lg p-6'>
      <h2 className='text-2xl font-semibold mb-4'>Method 3: Import as React Component Directly (Default Export)</h2>

      <div className='flex flex-col gap-4'>
        <CodeBlock code={`import ViteIconUrl from '../../../../assets/vite2.svg';`} />

        {/* If exportType is 'named', switch Comment on these 2 lines: */}
        <p className='text-blue-500'>
          Configuration is currently set to `exportType: 'default'`, so we can't see the SVG. Hence you see this line
          instead.
        </p>
        {/* <ViteIconComponent className='w-24 h-24' /> */}

        <p>For this code to work you need to change the `svgrOptions` in the `vite.config.ts` file to:</p>

        <CodeBlock
          code={`import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  plugins: [
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'default',
      },
    }),
  ],
}));
`}
        />

        <p>
          It would also mean that the import style of{' '}
          <code className='text-purple-500'>{`import { ReactComponent as ViteIconComponent } from '../../../../assets/vite2.svg';`}</code>{' '}
          <strong className='text-red-500'>would stop working!</strong>.
        </p>
      </div>
    </section>
  );
}
