export const INSTALL_COMMAND = `pnpm add @fontsource/rubik`;

export const IMPORT_CODE = `import '@fontsource/rubik/latin-400.css';
import '@fontsource/rubik/latin-500.css';
import '@fontsource/rubik/latin-700.css';`;

export const FONT_FACE_CODE = `/* node_modules/@fontsource/rubik/latin-400.css */
@font-face {
  font-family: 'Rubik';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(./files/rubik-latin-400-normal.woff2) format('woff2'),
    url(./files/rubik-latin-400-normal.woff) format('woff');
}`;

export const APPLY_CODE = `.page {
  font-family: 'Rubik', sans-serif;
}`;

export const ENTRY_IMPORT_CODE = `// src/main.tsx — import here when the whole app should use Rubik
import '@fontsource/rubik/latin-400.css';
import '@fontsource/rubik/latin-500.css';
import '@fontsource/rubik/latin-700.css';`;
