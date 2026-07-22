import { REGEX } from '@src/common/constants';
import { createNewRuleFactory } from './createNewRuleFactory';

export const createIntegerNumbersOnlyRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => newValue === '' || REGEX.integerNumbers.test(newValue),
});
