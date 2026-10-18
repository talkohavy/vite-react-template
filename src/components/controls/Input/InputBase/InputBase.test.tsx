import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import InputBase from './InputBase';

describe('InputBase', () => {
  it('should render', () => {
    render(<InputBase value='' setValue={() => {}} placeholder='placeholder' />);

    const inputElement = screen.getByTestId('Input');

    expect(inputElement).toBeInTheDocument();
  });

  it('should render with value', () => {
    render(<InputBase value='hello world' setValue={() => {}} placeholder='placeholder' />);

    const inputElement = screen.getByDisplayValue('hello world');

    expect(inputElement).toBeInTheDocument();
  });

  it('should call setValue, and render the correct value', () => {
    function InputWithControlledState() {
      const [value, setValue] = useState('');

      return <InputBase value={value} setValue={(e) => setValue(e.target.value)} />;
    }

    render(<InputWithControlledState />);

    const inputElement = screen.getByTestId<HTMLInputElement>('Input');

    inputElement.focus();
    fireEvent.change(inputElement, { target: { value: 'typedValue' } });

    expect(inputElement).toHaveValue('typedValue');
  });

  it('should render with the correct placeholder', () => {
    render(<InputBase value='' setValue={() => {}} placeholder='Enter text here' />);

    const inputElement = screen.getByPlaceholderText('Enter text here');

    expect(inputElement).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<InputBase value='' setValue={() => {}} disabled />);

    const inputElement = screen.getByTestId('Input');

    expect(inputElement).toBeDisabled();
  });
});
