import CodeBlock from '@src/components/CodeBlock';
import styles from './GoogleFontPage.module.scss';
import { APPLY_CODE, ENTRY_IMPORT_CODE, FONT_FACE_CODE, IMPORT_CODE, INSTALL_COMMAND } from './logic/constants';
import '@fontsource/rubik/latin-400.css';
import '@fontsource/rubik/latin-500.css';
import '@fontsource/rubik/latin-700.css';

const SPECIMEN = 'The quick brown fox jumps over the lazy dog.';

export default function GoogleFontPage() {
  return (
    <div className={`${styles.page} flex size-full flex-col gap-8 overflow-auto p-6`}>
      <header className='flex max-w-3xl flex-col gap-2'>
        <h1 className='text-4xl font-bold tracking-tight text-gray-900 dark:text-white'>Bundle a Google Font</h1>

        <hr />
        <br />

        <h2 className='text-6xl font-bold tracking-tight text-gray-900 dark:text-white'>What's</h2>
        <h2 className='text-6xl font-bold tracking-tight text-[#2a64f6] dark:text-[#5b8cff]'>The code?</h2>

        <br />
        <hr />
        <br />

        <h2 className='text-6xl font-bold tracking-tight text-gray-900 dark:text-white'>What do</h2>
        <h2 className='text-6xl font-bold tracking-tight text-[#2a64f6] dark:text-[#5b8cff]'>you need?</h2>

        <br />
        <hr />

        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This page is set in Rubik. The font files ship inside the app build and are served from this origin. Nothing
          is requested from fonts.googleapis.com or fonts.gstatic.com when the page loads.
        </p>
      </header>

      <section className='flex max-w-3xl flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>Specimen</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Three weights are bundled: 400, 500, and 700. Each line below uses one of those weights.
        </p>
        <div className='flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900'>
          <p className='text-2xl text-gray-900 dark:text-gray-100' style={{ fontWeight: 400 }}>
            <span className='mb-1 block text-xs font-normal tracking-wide text-gray-500 uppercase'>Regular 400</span>
            {SPECIMEN}
          </p>
          <p className='text-2xl text-gray-900 dark:text-gray-100' style={{ fontWeight: 500 }}>
            <span className='mb-1 block text-xs tracking-wide text-gray-500 uppercase' style={{ fontWeight: 400 }}>
              Medium 500
            </span>
            {SPECIMEN}
          </p>
          <p className='text-2xl text-gray-900 dark:text-gray-100' style={{ fontWeight: 700 }}>
            <span className='mb-1 block text-xs tracking-wide text-gray-500 uppercase' style={{ fontWeight: 400 }}>
              Bold 700
            </span>
            {SPECIMEN}
          </p>
        </div>
      </section>

      <section className='flex max-w-3xl flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>1. Install the font files</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          <a
            href='https://fontsource.org/fonts/rubik'
            target='_blank'
            rel='noreferrer'
            className='text-blue-600 underline dark:text-blue-400'
          >
            Fontsource
          </a>{' '}
          republishes the Google Fonts files as an npm package. Installing it copies the woff2 and woff files into{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>node_modules</code>. The same command works for
          any other family on fontsource.org: swap{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>rubik</code> for that family&apos;s package name.
        </p>
        <CodeBlock language='bash' code={INSTALL_COMMAND} />
      </section>

      <section className='flex max-w-3xl flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>2. Import only the files you use</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Each CSS file in the package is one{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>@font-face</code> rule. Importing it from a module
          is what pulls the font into the bundle. Vite reads the{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>url()</code> inside that rule and emits the font
          file as a hashed asset, the same way it emits an imported image.
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This page imports the Latin subset at weights 400, 500, and 700. The Latin woff2 for weight 400 is about 18
          KB. Importing <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>@fontsource/rubik/400.css</code>{' '}
          instead would also include Arabic, Cyrillic, Hebrew, and Latin Extended. Importing the package root includes
          every weight and every subset.
        </p>
        <CodeBlock language='typescript' code={IMPORT_CODE} />
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          The imported file looks like this.{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>font-display: swap</code> is already set, so text
          paints with the fallback face until Rubik is ready. The{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>src</code> lists woff2 first, then woff. Vite
          emits both files. A browser that understands woff2 requests only the woff2.
        </p>
        <CodeBlock language='css' code={FONT_FACE_CODE} />
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Those imports live in this page&apos;s module, so Rubik is loaded with this route. Put the same imports in{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>src/main.tsx</code> when the whole app should use
          the font.
        </p>
        <CodeBlock language='typescript' code={ENTRY_IMPORT_CODE} />
      </section>

      <section className='flex max-w-3xl flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>3. Use the family name</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          The <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>@font-face</code> rule registers the name{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>Rubik</code>. Set that name on the elements that
          should use it. The second family is the fallback used before the file finishes loading, and on browsers that
          cannot read either file.
        </p>
        <CodeBlock language='css' code={APPLY_CODE} />
      </section>

      <section className='flex max-w-3xl flex-col gap-3'>
        <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>
          4. Confirm the files are in the build
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Run <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>pnpm build</code>. The output contains hashed
          files such as{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>rubik-latin-400-normal-&lt;hash&gt;.woff2</code>.
          In the browser Network panel, filter by Font. The Rubik requests use this app&apos;s origin. A request to
          fonts.googleapis.com or fonts.gstatic.com means the CDN snippet is still in the page.
        </p>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This project&apos;s service worker precaches hashed build assets, so the emitted font files are cached with
          the rest of the build and remain available offline.
        </p>
      </section>
    </div>
  );
}
