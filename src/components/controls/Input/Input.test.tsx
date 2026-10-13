import { useCallback, useRef, useState } from 'react';
import { wrapInDebounce } from '@talkohavy/lodash';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';
import { createNoLeadingOrTrailingSpacesRule } from './logic/rules/createNoLeadingOrTrailingSpacesRule';

describe('Input', () => {
  it('should render', () => {
    render(<Input onChange={() => {}} />);

    const inputElement = screen.getByTestId('Input');

    expect(inputElement).toBeInTheDocument();
  });

  it('should render with initial value', () => {
    render(<Input initialValue='hello world' onChange={() => {}} />);

    const inputElement = screen.getByDisplayValue('hello world');

    expect(inputElement).toBeInTheDocument();
  });

  it('should call onChange', () => {
    const typedValue = 'hello world';
    const onChange = jest.fn();

    render(<Input onChange={onChange} />);

    const inputElement = screen.getByTestId<HTMLInputElement>('Input');

    inputElement.focus();
    fireEvent.change(inputElement, { target: { value: typedValue } });

    expect(onChange).toHaveBeenCalled();
    expect(inputElement).toHaveValue(typedValue);
  });

  it('should sync the displayed value when the value prop changes', () => {
    const { rerender } = render(<Input value='first' onChange={() => {}} />);
    const inputElement = screen.getByTestId<HTMLInputElement>('Input');

    rerender(<Input value='second' onChange={() => {}} />);

    const expectedResult = 'second';
    const actualResult = inputElement.value;
    expect(actualResult).toEqual(expectedResult);
  });

  describe('Complex Input: with debounce & rule', () => {
    let shouldFetchData: jest.Mock;
    beforeEach(() => {
      shouldFetchData = jest.fn().mockImplementation((oldValue: string, newValue: string) => {
        const newValueTrimmed = newValue.trim();
        const shouldFetch = newValueTrimmed.length > 2 && oldValue.trim() !== newValueTrimmed;
        return shouldFetch;
      });
    });

    const noLeadingOrTrailingSpacesRule = createNoLeadingOrTrailingSpacesRule(45);

    function InputWithDebounceAndRule() {
      const [email, setEmail] = useState('');
      const prevEmail = useRef<string>('');

      // eslint-disable-next-line
      const shouldFetchDataDebounced = useCallback(
        wrapInDebounce((newValue: string) => {
          shouldFetchData(prevEmail.current, newValue);
          prevEmail.current = newValue;
          // do something!
        }, 1000),
        [],
      );

      const fetchOnEmailChange = (newValue: string) => {
        setEmail(newValue);
        shouldFetchDataDebounced(newValue);
      };

      return (
        <Input initialValue={email} onChange={fetchOnEmailChange} dontChangeRule={noLeadingOrTrailingSpacesRule} />
      );
    }

    it('should debounce the call to shouldFetchData and return true', async () => {
      jest.useFakeTimers();

      render(<InputWithDebounceAndRule />);

      const inputElement = screen.getByTestId<HTMLInputElement>('Input');

      inputElement.focus();
      fireEvent.change(inputElement, { target: { value: 'hello' } });

      expect(inputElement).toHaveValue('hello');
      expect(shouldFetchData).not.toHaveBeenCalled();

      jest.runAllTimers();

      expect(shouldFetchData).toHaveBeenCalledWith('', 'hello');
      expect(shouldFetchData).toHaveReturnedWith(true);

      jest.useRealTimers();
    });

    it('should debounce the call to shouldFetchData and return false', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });

      render(<InputWithDebounceAndRule />);

      const input = screen.getByTestId<HTMLInputElement>('Input');

      await user.type(input, 'aaa');

      expect(input).toHaveValue('aaa');
      expect(shouldFetchData).toHaveBeenCalledTimes(0);

      jest.runAllTimers();

      expect(shouldFetchData).toHaveBeenCalledTimes(1);
      expect(shouldFetchData).toHaveBeenCalledWith('', 'aaa');

      await user.type(input, 'bb{Backspace}{Backspace}');

      expect(input).toHaveValue('aaa');
      expect(shouldFetchData).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(shouldFetchData).toHaveBeenCalledTimes(2);
      expect(shouldFetchData).toHaveBeenCalledWith('', 'aaa');
      expect(shouldFetchData).toHaveReturnedWith(false);

      jest.useRealTimers();
    });
  });
});
