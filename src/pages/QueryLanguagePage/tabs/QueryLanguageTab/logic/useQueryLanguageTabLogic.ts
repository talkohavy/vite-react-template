import { useState, useMemo, useRef } from 'react';
import { getTextWidth } from '@src/common/utils/getTextWidth';
import { useOnCompletionSelect } from '@src/components/controls/QueryInput/logic/hooks/useOnCompletionSelect';
import { useQueryParser } from '@src/components/controls/QueryInput/logic/hooks/useQueryParser';
import { useSuggestionEngine } from '@src/components/controls/QueryInput/logic/hooks/useSuggestionEngine';
import { keyConfigs as initialKeyConfigs } from '../logic/constants';
import { astToFilterScheme } from './utils/astToFilterScheme';
import { validateKeysAndValues } from './utils/validateKeysAndValues';
import type { OpenChangeDetails } from '@src/components/controls/InputWithDropdown';
import type { KeyConfig } from '@src/components/controls/QueryInput/types';

export function useQueryLanguageTabLogic() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(query.length);
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [keyConfigs, _setKeyConfigs] = useState<KeyConfig[]>(initialKeyConfigs);
  // const [isLoadingKeyConfigs, setIsLoadingKeyConfigs] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const parseResult = useQueryParser({ query });

  const { expectedTypes, completions } = useSuggestionEngine({
    tokens: parseResult.tokens,
    cursorPosition,
    keyConfigs,
  });

  const filterScheme = useMemo(() => {
    const filterScheme = astToFilterScheme(parseResult.ast);

    return filterScheme;
  }, [parseResult.ast]);

  const validationResult = useMemo(() => {
    return validateKeysAndValues({ keyConfigs, ast: parseResult.ast });
  }, [parseResult.ast, keyConfigs]);

  /**
   * Generates a new query, and a cursor position, upon selection.
   * The find-and-replace logic is handled here.
   */
  const onCompletionSelect = useOnCompletionSelect({
    tokens: parseResult.tokens,
    cursorPosition,
    query,
    setIsDropdownOpen,
  });

  /**
   * Is invoked AFTER onCompletionSelect, with the new query and cursor position
   * that onCompletionSelect generates.
   *
   * Handles updating the query state, and scrolling the input to keep the cursor in view.
   */
  const onQueryChange = (value: string, cursorPosition?: number) => {
    setQuery(value);
    const newCursorPosition = cursorPosition ?? inputRef!.current?.selectionStart ?? 0;

    if (inputRef.current == null) return;

    if (cursorPosition !== undefined && cursorPosition !== inputRef.current.selectionStart) {
      inputRef.current!.setSelectionRange(cursorPosition, cursorPosition);

      // Calculate pixel position of cursor and scroll to it
      const textBeforeCursor = value.substring(0, cursorPosition);
      const cursorPixelPosition = getTextWidth({ text: textBeforeCursor, fontSize: 13, fontFamily: 'monospace' });
      const inputWidth = inputRef.current.clientWidth;

      // Center the cursor in the view if possible
      const scrollPosition = Math.max(0, cursorPixelPosition - inputWidth / 2) - 100;

      setTimeout(() => {
        inputRef.current!.scrollTo({ left: scrollPosition, behavior: 'smooth' });
      }, 0);
    }

    setCursorPosition(newCursorPosition);
  };

  const handleDropdownOpenChange = (details: OpenChangeDetails) => {
    if (details.reason === 'arrow-key' || details.reason === 'input-change') {
      const shouldShowDropdown = expectedTypes.length > 0 && completions.length > 0;
      setIsDropdownOpen(shouldShowDropdown);
      return;
    }

    if (details.reason === 'clear-trigger') {
      setIsDropdownOpen(true);
      return;
    }

    setIsDropdownOpen(details.open);
  };

  const isValid = parseResult.success && validationResult.areAllKeysValid && validationResult.areAllValuesValid;

  // Combine "syntax errors" and "validation errors" for display
  const allErrors = useMemo(() => {
    return [...parseResult.errors, ...validationResult.errors];
  }, [parseResult.errors, validationResult.errors]);

  return {
    inputRef,
    query,
    onQueryChange,
    isDropdownOpen,
    handleDropdownOpenChange,
    completions,
    onCompletionSelect,
    setCursorPosition,
    isValid,
    errors: allErrors,
    filterScheme,
    parseResult,
  };
}
