import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { defineConfig, loadEnv, lazyPlugins } from 'vite-plus';

export default defineConfig(({ mode }) => {
  const rootDir = __dirname;

  /**
   * Explanation about Environment Variables:
   *
   * 1. vite.config.ts runs in Node when Vite starts. At that moment, no .env file has been loaded yet.
   * 2. process.env only has what’s in the shell (and any env vars set before running Vite).
   * 3. import.meta.env is filled later by Vite for your app code, not for the config. So in the config it won’t have your .env values.
   *
   * Solution: Use Vite's loadEnv() inside defineConfig so the config explicitly loads your .env.
   */
  const VITE_PREFIX = 'VITE_'; // <--- Only load VITE_ prefixed variables. Filters out all other variables.
  const env = loadEnv(mode, rootDir, VITE_PREFIX);
  const port = env.VITE_PORT ? Number(env.VITE_PORT) : 3004;

  return {
    lint: {
      plugins: ['typescript', 'react', 'import'],
      categories: {
        correctness: 'off',
      },
      env: {
        builtin: true,
        browser: true,
        commonjs: true,
        node: true,
        'shared-node-browser': true,
      },
      ignorePatterns: ['dist', 'coverage', 'iframe-server'],
      rules: {
        'constructor-super': 'error',
        'for-direction': 'error',
        'getter-return': 'error',
        'no-async-promise-executor': 'error',
        'no-case-declarations': 'error',
        'no-class-assign': 'error',
        'no-compare-neg-zero': 'error',
        'no-cond-assign': 'error',
        'no-const-assign': 'error',
        'no-constant-binary-expression': 'error',
        'no-constant-condition': 'error',
        'no-control-regex': 'error',
        'no-debugger': 'warn',
        'no-delete-var': 'error',
        'no-dupe-class-members': 'error',
        'no-dupe-else-if': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty': 'error',
        'no-empty-character-class': 'error',
        'no-empty-pattern': 'error',
        'no-empty-static-block': 'error',
        'no-ex-assign': 'error',
        'no-extra-boolean-cast': 'error',
        'no-fallthrough': 'error',
        'no-func-assign': 'error',
        'no-global-assign': 'error',
        'no-import-assign': 'error',
        'no-invalid-regexp': 'error',
        'no-irregular-whitespace': 'error',
        'no-loss-of-precision': 'error',
        'no-misleading-character-class': 'error',
        'no-new-native-nonconstructor': 'error',
        'no-nonoctal-decimal-escape': 'error',
        'no-obj-calls': 'error',
        'no-prototype-builtins': 'error',
        'no-redeclare': 'error',
        'no-regex-spaces': 'error',
        'no-self-assign': 'error',
        'no-setter-return': 'error',
        'no-shadow-restricted-names': 'error',
        'no-sparse-arrays': 'error',
        'no-this-before-super': 'error',
        'no-undef': 'error',
        'no-unexpected-multiline': 'error',
        'no-unreachable': 'error',
        'no-unsafe-finally': 'error',
        'no-unsafe-negation': 'error',
        'no-unsafe-optional-chaining': 'error',
        'no-unused-labels': 'error',
        'no-unused-private-class-members': 'error',
        'no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'all',
            argsIgnorePattern: '(^_|^req$|^res$|^next$)',
            caughtErrors: 'all',
            caughtErrorsIgnorePattern: '^_',
            destructuredArrayIgnorePattern: '^_',
            ignoreRestSiblings: false,
            varsIgnorePattern: '^React$',
          },
        ],
        'no-useless-backreference': 'error',
        'no-useless-catch': 'error',
        'no-useless-escape': 'error',
        'no-with': 'error',
        'require-yield': 'error',
        'use-isnan': 'error',
        'valid-typeof': 'error',
        'no-array-constructor': 'error',
        'no-unused-expressions': 'error',
        'import/no-duplicates': [
          'error',
          {
            preferInline: false,
          },
        ],
        'no-unassigned-vars': 'error',
        'no-useless-assignment': 'error',
        'import/newline-after-import': [
          'error',
          {
            count: 1,
          },
        ],
        'react/rules-of-hooks': 'warn',
        'react/exhaustive-deps': 'warn',
        'react/static-components': 'error',
        'react/use-memo': 'error',
        'react/void-use-memo': 'error',
        'react/preserve-manual-memoization': 'error',
        'react/incompatible-library': 'warn',
        'react/immutability': 'error',
        'react/globals': 'error',
        'react/refs': 'error',
        'react/set-state-in-effect': 'error',
        'react/error-boundaries': 'error',
        'react/purity': 'error',
        'react/set-state-in-render': 'error',
        'react/unsupported-syntax': 'warn',
        'typescript/no-duplicate-enum-values': 'error',
        'typescript/no-empty-object-type': 'error',
        'typescript/no-extra-non-null-assertion': 'error',
        'typescript/no-misused-new': 'error',
        'typescript/no-namespace': 'error',
        'typescript/no-non-null-asserted-optional-chain': 'error',
        'typescript/no-require-imports': 'error',
        'typescript/no-this-alias': 'error',
        'typescript/no-unnecessary-type-constraint': 'error',
        'typescript/no-unsafe-declaration-merging': 'error',
        'typescript/no-unsafe-function-type': 'error',
        'typescript/no-wrapper-object-types': 'error',
        'typescript/prefer-as-const': 'error',
        'typescript/prefer-namespace-keyword': 'error',
        'typescript/triple-slash-reference': 'error',
        'vite-plus/prefer-vite-plus-imports': 'error',
      },
      overrides: [
        {
          files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
          rules: {
            'constructor-super': 'off',
            'getter-return': 'off',
            'no-class-assign': 'off',
            'no-const-assign': 'off',
            'no-dupe-class-members': 'off',
            'no-dupe-keys': 'off',
            'no-func-assign': 'off',
            'no-import-assign': 'off',
            'no-new-native-nonconstructor': 'off',
            'no-obj-calls': 'off',
            'no-redeclare': 'off',
            'no-setter-return': 'off',
            'no-this-before-super': 'off',
            'no-undef': 'off',
            'no-unreachable': 'off',
            'no-unsafe-negation': 'off',
            'no-var': 'error',
            'no-with': 'off',
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
          },
        },
      ],
      options: {
        typeAware: true,
        typeCheck: true,
      },
      jsPlugins: [
        {
          name: 'vite-plus',
          specifier: 'vite-plus/oxlint-plugin',
        },
      ],
    },
    fmt: {
      useTabs: false,
      tabWidth: 2,
      trailingComma: 'all',
      semi: true,
      singleQuote: true,
      jsxSingleQuote: true,
      bracketSameLine: false,
      bracketSpacing: true,
      arrowParens: 'always',
      printWidth: 120,
      proseWrap: 'preserve',
      htmlWhitespaceSensitivity: 'css',
      embeddedLanguageFormatting: 'off',
      quoteProps: 'as-needed',
      sortPackageJson: false,
      sortImports: {
        order: 'asc',
        ignoreCase: true,
        internalPattern: ['@src/', '~/'],
        partitionByComment: false,
        newlinesBetween: false,
        groups: [
          'react',
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'type-internal',
          'type',
          ['type-parent', 'type-sibling', 'type-index'],
          'unknown',
        ],
        customGroups: [{ groupName: 'react', elementNamePattern: ['react', 'react-*', 'react-*/**'] }],
      },
      overrides: [
        {
          files: ['*.yaml'],
          options: {
            bracketSpacing: false,
          },
        },
      ],
      ignorePatterns: [
        '/node_modules',
        'package-lock.json',
        'pnpm-lock.yaml',
        '/coverage',
        '/build',
        '/certs',
        '**/*/dist',
        '**/.DS_Store',
        '**/.env.*',
        '**/.git',
        '.gitignore',
        '.idea/',
      ],
    },
    test: {
      environment: 'jsdom',
      setupFiles: [path.resolve(__dirname, 'src/tests/setup.ts')],
      passWithNoTests: true,
    },
    root: `${process.cwd()}/src`, // <--- defaults to process.cwd(). where the index.html is located.
    plugins: lazyPlugins(() => [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      // basicSsl(), // <--- Enable this to have HTTPS in dev
      tailwindcss(),
      svgr({
        include: '**/*.svg',
        svgrOptions: { exportType: 'named' }, // <--- See page "SvgImports" for more details.
      }),
    ]),
    publicDir: './public', // defaults to "public". The location of the public dir relative to `root`.
    server: {
      open: true,
      port,
      strictPort: false,
      origin: `http://localhost:${port}`, // <--- Defaults to '/'. Defines the origin of the generated asset URLs during development ONLY. Without this, serving of the mf-manifest.json in micro-frontends doesn't work! Since it takes the host's origin.
      watch: {
        // ignored: ['**/.env'], // <--- by default, Vite watches the .env file (which is good). However, if you want to ignore it, you can do so here.
      },
    },
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, 'src'),
      },
    },
    envDir: rootDir,
    clearScreen: false, // <--- default is true. false prevents Vite from clearing the terminal screen when logging certain messages
    logLevel: 'info', // <--- default is info. Options are: info, warn, error, silent
    // envPrefix: 'VITE_', // <--- default is VITE_
    // appType: 'spa', // <--- default is spa. For ssr, use custom
    cacheDir: '../node_modules/.cache/vite',
    build: {
      outDir: '../dist', // <--- default is dist. Specify the output directory (relative to project root).
      sourcemap: true, // <--- default is false. Options are: true, false, inline, hidden. Generate production source maps. If true, a separate sourcemap file will be created. If 'inline', the sourcemap will be appended to the resulting output file as a data URI. 'hidden' works like true except that the corresponding sourcemap comments in the bundled files are suppressed.
      minify: 'esbuild', // <--- Options are: 'esbuild' (default) | 'terser'. The default is esbuild which is 20 ~ 40x faster than terser and only 1 ~ 2% worse compression. Terser must be installed when it is set to 'terser'.
      target: 'esnext', // <--- default is modules. Options are: modules, esnext,
      manifest: 'vite-manifest.json', // <--- Defaults to false. When set to `true`, the build will also generate a manifest.json file that contains a mapping of non-hashed asset filenames to their hashed versions, which can then be used by a server framework to render the correct asset links. When the value is a string, it will be used as the manifest file name (i.e. outputs to dist/vite-manifest.json instead of dist/.vite/manifest.json).
      // ssrManifest: true, // <--- When set to true, the build will also generate an SSR manifest for determining style links and asset preload directives in production. When the value is a string, it will be used as the manifest file name. Defaults to false.
      emptyOutDir: true, // <--- defaults to true if outDir is inside root. By default, Vite will empty the outDir on build if it is inside project root. It will emit a warning if outDir is outside of root to avoid accidentally removing important files. You can explicitly set this option to suppress the warning. This is also available via command line as --emptyOutDir
      chunkSizeWarningLimit: 500, // <--- default is 500. Limit for chunk size warnings (in kbs).
      watch: null, // <--- default is null. Set to {} to enable rollup watcher.
      assetsDir: 'main', // <--- default is assets. Specify the directory to nest generated assets under (relative to build.outDir).
      assetsInlineLimit: 4096, // <--- default is 4096. Imported or referenced assets that are smaller than this threshold will be inlined as base64 URLs to avoid extra http requests. Set to 0 to disable inlining altogether.
      cssCodeSplit: true, // <--- default is true. Enable/disable CSS code splitting. When enabled, CSS imported in async chunks will be inlined into the async chunk itself and inserted when the chunk is loaded. If disabled, all CSS in the entire project will be extracted into a single CSS file.
      cssMinify: 'esbuild', // <--- Options are: 'esbuild' (default) | 'lightningcss'.
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name].[hash].js', // <--- JS entry files
          chunkFileNames: 'static/js/[name].[hash].js', // <--- JS chunk files
          assetFileNames: (assetInfo) => {
            // Organize assets by file type
            const info = assetInfo.name || '';

            // CSS files
            if (/\.css$/i.test(info)) {
              return 'static/css/[name].[hash][extname]';
            }

            // Image files
            if (/\.(png|jpe?g|gif|svg|webp|avif|ico|bmp|tiff?)$/i.test(info)) {
              return 'static/images/[name].[hash][extname]';
            }

            // Font files
            if (/\.(woff2?|eot|ttf|otf)$/i.test(info)) {
              return 'static/fonts/[name].[hash][extname]';
            }

            // Other assets
            return 'static/assets/[name].[hash][extname]';
          },
        },
      },
    },
    preview: { port, strictPort: true, open: false }, // When running `npm run preview` locally, no loadEnvVariables process occurs, so VITE_PORT would be undefined. On a CI however, there are always ENV VARIABLES set in the global scope so it *would* work.
    css: {
      modules: {
        generateScopedName: mode === 'development' ? '[name].[local].[hash:base64:3]' : '[hash:base64:7]', // <--- A className named "sharedBtn" found at a css file named "App.module.css" would turn into: Button-module-sharedBtn-LyEfZ. `name` is the component name, and `local` is the css class name.
        localsConvention: 'camelCase', // <--- default to `undefined`. Leaving it as `undefined` doesn't work, so you need to choose one. camelCaseOnly would ignore a style like this: 'resize_none', whereas camelCase would accept it.
        scopeBehaviour: 'local', // <--- Defaults to 'local'. Always use 'local'. 'global' would disregard the .module.css extension, and make all css as global.
      },
      preprocessorOptions: {
        scss: {
          // Allow SASS to resolve imports from project root (so 'src/...' paths work)
          loadPaths: [path.resolve(__dirname)],
        },
      },
      devSourcemap: true, // <--- defaults to `false`. The provided value here will affect the Elements --> Styles tab. With `true`, the clickable link would read "Button.module.css", and clicking it would direct you to the file. When `false`, it would read `<style>`, and clicking it would direct you to a <style> element on the <head> element.
      transformer: 'postcss', // <--- Defaults to `postcss`. Options are: 'postcss' (default) | 'lightningcss'. While Lightning CSS handles the most commonly used PostCSS plugins like autoprefixer, postcss-preset-env, and CSS modules, you may still need PostCSS for more custom plugins like TailwindCSS. If that's the case, your PostCSS config will be picked up automatically.
    },
  };
});
