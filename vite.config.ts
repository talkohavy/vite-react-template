import path from 'node:path';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
// import basicSsl from '@vitejs/plugin-basic-ssl';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

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
    root: `${process.cwd()}/src`, // <--- defaults to process.cwd(). where the index.html is located.
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      // basicSsl(), // <--- Enable this to have HTTPS in dev
      tailwindcss(),
      svgr({
        include: '**/*.svg',
        svgrOptions: { exportType: 'named' }, // <--- See page "SvgImports" for more details.
      }),
    ],
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
