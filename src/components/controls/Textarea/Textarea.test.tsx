import { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vite-plus/test';
import Textarea from './Textarea';

describe('Textarea', () => {
  it('should render', () => {
    render(<Textarea value='' setValue={() => {}} placeholder='placeholder' />);

    const textareaElement = screen.getByTestId('Textarea');

    expect(textareaElement).toBeInTheDocument();
  });

  it('should render with value', () => {
    render(<Textarea value='hello world' setValue={() => {}} placeholder='placeholder' />);

    const textareaElement = screen.getByDisplayValue('hello world');

    expect(textareaElement).toBeInTheDocument();
  });

  it('should call setValue, and render the correct value', () => {
    function TextareaWithControlledState() {
      const [value, setValue] = useState('');

      return <Textarea value={value} setValue={(e) => setValue(e.target.value)} />;
    }

    render(<TextareaWithControlledState />);

    const textareaElement = screen.getByTestId<HTMLTextAreaElement>('Textarea');

    textareaElement.focus();
    fireEvent.change(textareaElement, { target: { value: 'typedValue' } });

    expect(textareaElement).toHaveValue('typedValue');
  });

  it('should render with the correct placeholder', () => {
    render(<Textarea value='' setValue={() => {}} placeholder='Enter text here' />);

    const textareaElement = screen.getByPlaceholderText('Enter text here');

    expect(textareaElement).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is true', () => {
    render(<Textarea value='' setValue={() => {}} disabled />);

    const textareaElement = screen.getByTestId('Textarea');

    expect(textareaElement).toBeDisabled();
  });
});
