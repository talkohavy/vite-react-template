import { useState } from 'react';
import { Combobox as ComboboxOriginal, createListCollection, useCombobox } from '@ark-ui/react/combobox';
import { Field } from '@ark-ui/react/field';
import { Portal } from '@ark-ui/react/portal';
import clsx from 'clsx';
import CloseIcon from '../../svgs/CloseIcon';
import DownArrow from '../../svgs/DownArrow';
import styles from './Autocomplete.module.scss';
import type { SelectOption } from '../Select/types';

type InputValueChangeDetails = ComboboxOriginal.InputValueChangeDetails;
type ValueChangeDetails<T> = ComboboxOriginal.ValueChangeDetails<T>;

const {
  RootProvider,
  Label,
  Control,
  Trigger,
  Input,
  ClearTrigger,
  Positioner,
  Content,
  ItemGroup,
  Item,
  ItemText,
  ItemIndicator,
} = ComboboxOriginal;

type AutocompleteProps = {
  selectOption: SelectOption | null;
  setSelectOption: (value: any) => void;
  /**
   * WARNING!
   *
   * value cannot be 0! Component does not know how to handle it when navigating using keyboard arrows.
   */
  options: Array<SelectOption>;
  placeholder?: string;
  label?: string;
  allowCustomValue?: boolean;
  autoFocus?: boolean;
  closeOnSelect?: boolean;
  disabled?: boolean;
  isInvalid?: boolean;
  loop?: boolean;
  isMultiSelect?: boolean;
  className?: string;
  labelClassName?: string;
  triggerClassName?: string;
  clearIconClassName?: string;
  dropdownClassName?: string;
} & Field.RootProps;

export default function Autocomplete(props: AutocompleteProps) {
  const {
    label,
    selectOption,
    setSelectOption,
    options,
    placeholder,
    allowCustomValue,
    autoFocus,
    closeOnSelect,
    disabled,
    isInvalid,
    loop,
    isMultiSelect,
    labelClassName,
    className,
    triggerClassName,
    clearIconClassName,
    dropdownClassName,
    ...rest
  } = props;

  const [filteredItems, setFilteredItems] = useState(options);

  const collection = createListCollection({ items: filteredItems });

  const handleInputChange = (details: InputValueChangeDetails) => {
    const newValue = details.inputValue.toLowerCase();
    const newFilteredItems = options.filter(({ label }) => label.toLowerCase().includes(newValue));
    if (newFilteredItems.length) {
      setFilteredItems(newFilteredItems);
    } else {
      setFilteredItems(options);
    }
  };

  const handleValueChange = (details: ValueChangeDetails<SelectOption>) => {
    const selectedItem = details.items[0];

    setSelectOption(selectedItem);
  };

  const combobox = useCombobox({
    collection,
    onInputValueChange: handleInputChange,
    onValueChange: handleValueChange,
    defaultInputValue: selectOption ? selectOption.label : undefined,
    defaultValue: selectOption?.value ? [selectOption?.value as any] : undefined,
    disabled,
    invalid: isInvalid,
    loopFocus: loop,
    autoFocus,
    allowCustomValue,
    multiple: isMultiSelect,
    closeOnSelect,
  });

  return (
    <Field.Root {...rest}>
      <RootProvider
        value={combobox}
        // onExitComplete={() => {}}
      >
        <Label className={labelClassName}>{label}</Label>

        <Control className={clsx(styles.control, className)}>
          <Input placeholder={placeholder} className='w-full' />

          <div className='shrink-0'>
            <ClearTrigger className={clsx(styles.clearIcon, clearIconClassName)}>
              <CloseIcon />
            </ClearTrigger>

            <Trigger className={clsx(styles.trigger, triggerClassName)}>
              <DownArrow />
            </Trigger>
          </div>
        </Control>

        <Portal>
          <Positioner className={styles.dropdown}>
            <Content className={clsx(styles.content, dropdownClassName)}>
              <ItemGroup>
                {/* <ItemGroupLabel>Frameworks</ItemGroupLabel> */}
                {collection.items.map((item) => (
                  <Item key={item.value} item={item} className={styles.item}>
                    <ItemIndicator className={styles.selectItemIndicator}>✓</ItemIndicator>

                    <ItemText>{item.label}</ItemText>
                  </Item>
                ))}
              </ItemGroup>
            </Content>
          </Positioner>
        </Portal>
      </RootProvider>
    </Field.Root>
  );
}
