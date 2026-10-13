import { useState } from 'react';
import InputBase from './InputBase';
import type { RuleReturnValue } from './types';

export type InputProps = {
  refElement?: React.Ref<HTMLInputElement>;
  /**
   * @default 'text'
   */
  type?: 'text' | 'password';
  onChange: (value: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * The initial value on mount.
   */
  initialValue?: string;
  /**
   * Do NOT use arbitrary! Would cause two renders!
   *
   * This is used to sync the internal display state when the parent pushes a new value from outside.
   *
   * Example case: loading data from an API, when the Input is already mounted (e.g. auto-fill, import).
   *
   * This is intentionally separate from `initialValue`, since this one
   * means that two renders will happen, where as for `initialValue` it would only happen once.
   */
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  dontChangeRule?: (e: any, newValue: string) => RuleReturnValue;
  className?: string;
  id?: string;
  testId?: string;
};

export default function Input(props: InputProps) {
  const {
    refElement,
    type = 'text',
    onChange,
    onSelect,
    initialValue = '',
    value,
    disabled,
    placeholder,
    autoFocus,
    dontChangeRule,
    className,
    id,
    testId = '',
  } = props;

  const [innerValue, setInnerValue] = useState(value ?? initialValue);
  const [prevValue, setPrevValue] = useState(value);

  /**
   * Sync internal display state when the parent pushes a new value from outside
   * (e.g. auto-fill, import). Only fires on external changes — never on user keystrokes —
   * so dontChangeRule gating and debounced onChange remain fully intact.
   */
  if (value !== prevValue) {
    setPrevValue(value);
    if (value !== undefined) setInnerValue(value);
  }

  const onTargetValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { shouldChange, newValue } = dontChangeRule?.(e, e.target.value) ?? {
      shouldChange: true,
      newValue: e.target.value,
    };

    if (shouldChange) {
      onChange?.(newValue, e);
      setInnerValue(newValue);
    }
  };

  return (
    <InputBase
      refElement={refElement}
      type={type}
      value={innerValue}
      setValue={onTargetValueChange}
      onSelect={onSelect}
      placeholder={placeholder}
      autoFocus={autoFocus}
      disabled={disabled}
      className={className}
      id={id}
      testId={testId}
    />
  );
}
