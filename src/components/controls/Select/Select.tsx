import {
  Arrow,
  Root,
  Trigger,
  Value,
  Icon,
  Portal,
  Viewport,
  Group,
  ScrollDownButton,
  ScrollUpButton,
  Content,
} from '@radix-ui/react-select';
import clsx from 'clsx';
import { addDataAttributeWhen } from '@src/common/utils/addDataAttributeWhen';
import DownArrow from '../../svgs/DownArrow';
import styles from './Select.module.scss';
import SelectItem from './SelectItem';
import type { SelectOption } from './types';

export type SelectProps = {
  selectedOption: SelectOption;
  setSelectedOption: (value: any) => void;
  options: Array<SelectOption>;
  /**
   * Only visible when selectedOption is `null` or an empty object.
   */
  placeholder?: string;
  disabled?: boolean;
  isRequired?: boolean;
  /**
   * @default 5
   */
  sideOffset?: number;
  /**
   * @default 'bottom'
   */
  placement?: 'bottom' | 'left' | 'right' | 'top';
  /**
   * @default 'start'
   */
  align?: 'center' | 'start' | 'end';
  /**
   * An offset in pixels from the "start" or "end" alignment options. Only available when position is set to popper.
   */
  alignOffset?: number;
  ariaLabel?: string;
  showArrow?: boolean;
  /**
   * Show scroll buttons on the content menu.
   *
   * @default false
   */
  showScrollButtons?: boolean;
  className?: string;
  dropdownClassName?: string;
  /**
   * Applies to all items in the dropdown.
   *
   * To affect only the selected item, use `itemClassName[data-state="checked"]`
   *
   * @example
   * itemClassName='bg-red-500 data-[state=checked]:bg-blue-500'
   */
  itemClassName?: string;
};

export default function Select(props: SelectProps) {
  const {
    selectedOption,
    setSelectedOption,
    options,
    placeholder,
    disabled,
    isRequired,
    sideOffset = 5,
    placement,
    align,
    alignOffset,
    showArrow,
    showScrollButtons = false,
    ariaLabel,
    className,
    dropdownClassName,
    itemClassName,
  } = props;

  function onValueChange(chosenValue: string) {
    const chosenValueAsString = chosenValue.toString();
    const selectedOption = options.find(({ value }) => value.toString() === chosenValueAsString);

    if (!selectedOption) {
      throw new Error("Select component couldn't find an option to match chosenValue on onValueChange");
    }

    setSelectedOption(selectedOption);
  }

  return (
    <Root
      value={selectedOption?.value as any}
      onValueChange={onValueChange}
      dir='ltr'
      disabled={disabled}
      required={isRequired}
      // open={isOpen}
      // onOpenChange={setIsOpen}
      // name='' // <--- The name of the select. Submitted with its owning form as part of a name/value pair.
    >
      <Trigger className={clsx(styles.selectTrigger, className)} aria-label={ariaLabel}>
        <Value placeholder={placeholder} data-is-expanded={addDataAttributeWhen(!selectedOption?.value)} />
        <Icon className={styles.selectIcon}>
          <DownArrow className='size-2.5' />
        </Icon>
      </Trigger>

      <Portal>
        <Content
          position='popper' // <--- The positioning mode to use, 'item-aligned' is the default and behaves similarly to a native MacOS menu by positioning content relative to the active item. 'popper' positions content in the same way as our other primitives, for example Popover or DropdownMenu.
          side={placement}
          align={align}
          alignOffset={alignOffset}
          sideOffset={sideOffset}
          className={clsx(styles.selectContent, dropdownClassName)}
          // avoidCollisions={false} // <--- defaults to `true`
          // onEscapeKeyDown={(e)=>{}}
          // onPointerDownOutside={(e)=>{}}
          // sticky='always'
          // arrowPadding={arrowPadding}
          // hideWhenDetached // <--- defaults to false
        >
          {showScrollButtons && (
            <ScrollUpButton className={styles.selectScrollButton}>
              <DownArrow className='rotate-180 size-2.5' />
            </ScrollUpButton>
          )}

          <Viewport className={styles.selectViewport}>
            <Group>
              {options.map(({ value, label, disabled }) => (
                <SelectItem key={value} value={value} disabled={disabled} className={itemClassName}>
                  {label}
                </SelectItem>
              ))}
            </Group>
          </Viewport>

          {showScrollButtons && (
            <ScrollDownButton className={styles.selectScrollButton}>
              <DownArrow className='size-2.5' />
            </ScrollDownButton>
          )}

          {showArrow && <Arrow className={styles.dropdownMenuArrow} />}
        </Content>
      </Portal>
    </Root>
  );
}
