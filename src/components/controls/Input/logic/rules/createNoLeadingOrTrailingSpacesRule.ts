import { REGEX } from '@src/common/constants';
import { createNewRuleFactory } from './createNewRuleFactory';

export const createNoLeadingOrTrailingSpacesRule = createNewRuleFactory({
  checkIsValidValue: (newValue: string) => !REGEX.startsOrEndsWithWhitespace.test(newValue),
});
