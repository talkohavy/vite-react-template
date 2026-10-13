import { GroupLabels } from './constants';
import type { CompletionItem } from '../types';
import type { OptionGroup } from '@src/components/controls/InputWithDropdown';

type UseQueryInputLogicProps = {
  inputRef: any;
  onQueryChange: (value: string, cursorPosition?: number) => void;
  onCompletionSelect: (completion: CompletionItem) => { value: string; cursorPosition: number };
  setCursorPosition: (position: number) => void;
  completions: CompletionItem[];
};

export function useQueryInputLogic(props: UseQueryInputLogicProps) {
  // Calls no hooks, so the compiler won't infer it as one without this directive.
  'use memo';
  const { inputRef, onQueryChange, onCompletionSelect, setCursorPosition, completions } = props;

  const groupedCompletions = groupCompletions(completions);

  function handleCompletionSelect(completion: any) {
    const input = inputRef?.current;

    if (!input) return;

    const { value: newValue, cursorPosition: newCursorPosition } = onCompletionSelect(completion);

    onQueryChange(newValue, newCursorPosition);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }

  function updateCursorPosition(e: any) {
    const shouldUpdateCursor =
      // Left-mouse click
      (e.type === 'mousedown' && e.button === 0) ||
      // Arrow keys (alone, with alt, or with ctrl, but not shift)
      (e.type === 'keydown' && e.key === 'ArrowLeft' && !e.shiftKey) ||
      (e.type === 'keydown' && e.key === 'ArrowRight' && !e.shiftKey) ||
      // Home and End keys (alone or with ctrl)
      (e.type === 'keydown' && e.key === 'Home') ||
      (e.type === 'keydown' && e.key === 'End') ||
      // Page navigation keys
      (e.type === 'keydown' && e.key === 'PageUp') ||
      (e.type === 'keydown' && e.key === 'PageDown') ||
      // Select all (Ctrl+A)
      (e.type === 'keydown' && e.key === 'a' && e.ctrlKey && !e.shiftKey && !e.altKey);

    if (!shouldUpdateCursor) return;

    // Update cursor position on key navigation
    setTimeout(() => {
      setCursorPosition(e.target.selectionStart || 0);
    }, 0);
  }

  return { handleCompletionSelect, updateCursorPosition, groupedCompletions };
}

function groupCompletions(completions: CompletionItem[]) {
  const groupsArray: OptionGroup[] = [];

  completions.forEach((completionItem) => {
    const completionItemGroupLabel = GroupLabels[completionItem.type];
    const group = groupsArray.find((group) => group.groupLabel === completionItemGroupLabel);

    if (group) {
      group.items.push(completionItem);
    } else {
      const newGroup: OptionGroup = {
        groupLabel: completionItemGroupLabel,
        items: [completionItem],
      };
      groupsArray.push(newGroup);
    }
  });

  return groupsArray;
}
