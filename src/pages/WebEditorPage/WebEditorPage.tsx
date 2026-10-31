import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import clsx from 'clsx';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';
import { codeExamples } from './logic/constants';
import type { Language } from './types';

export default function WebEditorPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(codeExamples.javascript);

  function handleLanguageChange(language: Language) {
    setSelectedLanguage(language);
    setCode(codeExamples[language]);
  }

  function highlightCode(code: string) {
    try {
      const languageMap: Record<Language, any> = {
        javascript: Prism.languages.javascript,
        css: Prism.languages.css,
        json: Prism.languages.json,
      };

      const grammar = languageMap[selectedLanguage];

      if (!grammar) {
        return code; // Return plain code if no grammar available
      }

      return Prism.highlight(code, grammar, selectedLanguage);
    } catch (error) {
      console.warn('Syntax highlighting failed:', error);
      return code; // Fallback to plain code
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>React Simple Code Editor Demo</h1>
        <p className='text-gray-600 mb-8'>
          A simple, lightweight code editor with syntax highlighting powered by PrismJS.
        </p>

        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* Language Selector */}
          <div className='bg-gray-100 border-b border-gray-200 px-6 py-4'>
            <div className='block text-sm font-medium text-gray-700 mb-2'>Select Language:</div>
            <div className='flex flex-wrap gap-2'>
              {(Object.keys(codeExamples) as Language[]).map((language) => (
                <button
                  key={language}
                  type='button'
                  onClick={() => handleLanguageChange(language)}
                  className={clsx(
                    'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                    selectedLanguage === language
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
                  )}
                >
                  {language.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className='p-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>Code Editor ({selectedLanguage})</h3>
            <div className='border border-gray-300 rounded-md overflow-hidden'>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlightCode}
                padding={16}
                style={{
                  fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                  fontSize: 14,
                  lineHeight: 1.5,
                  backgroundColor: '#fafafa',
                  minHeight: '300px',
                }}
                textareaClassName='focus:outline-none'
                preClassName='overflow-auto'
              />
            </div>
          </div>

          <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
            <h4 className='text-md font-semibold text-gray-800 mb-3'>Raw Code Output:</h4>
            <pre className='bg-gray-100 p-4 rounded-md overflow-auto text-sm'>
              <code>{code}</code>
            </pre>
          </div>

          {/* Features Section */}
          <div className='bg-gray-50 px-6 py-4 border-t border-gray-200'>
            <h4 className='text-md font-semibold text-gray-800 mb-3'>Features:</h4>
            <ul className='text-sm text-gray-600 space-y-1'>
              <li>
                • <strong>Tab Key:</strong> Indent selected text or current line
              </li>
              <li>
                • <strong>Shift + Tab:</strong> Unindent selected text or current line
              </li>
              <li>
                • <strong>Ctrl/Cmd + A:</strong> Select all text
              </li>
              <li>
                • <strong>Ctrl/Cmd + Z:</strong> Undo (word-based undo)
              </li>
              <li>
                • <strong>Auto-indent:</strong> New lines automatically match previous line indentation
              </li>
              <li>
                • <strong>Bracket Wrapping:</strong> Select text and type (, [, or " to wrap selection
              </li>
            </ul>
          </div>
        </div>

        {/* Code Output Preview */}
        <div className='mt-8 bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='bg-gray-100 border-b border-gray-200 px-6 py-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Raw Code Output</h3>
          </div>
          <div className='p-6'>
            <pre className='bg-gray-100 p-4 rounded-md overflow-auto text-sm'>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
