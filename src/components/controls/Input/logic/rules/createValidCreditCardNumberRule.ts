import { REGEX } from '@src/common/constants';
import { createNewRuleFactory } from './createNewRuleFactory';

export const createValidCreditCardNumberRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => REGEX.partiallyValidCreditCard.test(newValue),
  transformNewValue: (newValue) => {
    newValue = newValue.replace(/\s/g, '');

    // Case 1: Add nothing
    if (newValue.length < 5) return '';

    // Case 2: Add +1 space
    if (newValue.length < 9) return `${newValue.substring(0, 4)} ${newValue.substring(4)}`;

    // Case 3: Add +2 space
    if (newValue.length < 13) return `${newValue.substring(0, 4)} ${newValue.substring(4, 8)} ${newValue.substring(8)}`;

    // Case 4: Add +3 spaces
    return `${newValue.substring(0, 4)} ${newValue.substring(4, 8)} ${newValue.substring(8, 12)} ${newValue.substring(
      12,
      16,
    )}`;
  },
});
