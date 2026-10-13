import type { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './CheckboxLogic.module.scss';

export type CheckboxLogicProps = PropsWithChildren<{
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  testId?: string;
}>;

export default function CheckboxLogic(props: CheckboxLogicProps) {
  const { children, isChecked, setIsChecked, disabled, label, className, testId = '' } = props;

  return (
    <label
      className={clsx(styles.checkboxLabel, className, disabled && styles.disabled)}
      data-test-id={`${testId}CheckboxLabel`}
    >
      <div className={styles.checkboxInputAndFakeCheckMark}>
        <input
          type='checkbox'
          checked={!!isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          disabled={disabled}
          className={styles.checkboxInput}
          data-test-id={`${testId}Checkbox`}
          aria-label={label}
        />

        {children}
      </div>

      {label && <span>{label}</span>}
    </label>
  );
}
