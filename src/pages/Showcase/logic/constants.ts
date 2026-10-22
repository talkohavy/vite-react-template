import { lazy, type ComponentType } from 'react';
import ButtonTab from '../tabs/ButtonTab';
import CheckboxesTab from '../tabs/CheckboxesTab';
import CodeBlockTab from '../tabs/CodeBlockTab';
import DatePickerTab from '../tabs/DatePickerTab';
import DropdownMenuTab from '../tabs/DropdownMenuTab';
import FormInputsTab from '../tabs/FormInputsTab';
import LoadersTab from '../tabs/LoadersTab';
import ModalTab from '../tabs/ModalTab';
import ProgressTab from '../tabs/ProgressTab';
import RadioTab from '../tabs/RadioTab';
import ToastTab from '../tabs/ToastTab';
import TogglesTab from '../tabs/TogglesTab';
import type { RadioOption } from '../../../components/controls/RadioButtons';

const WorldMapTab = lazy(() => import('../tabs/WorldMapTab'));

export const tabs: Array<RadioOption<ComponentType>> = [
  { value: 0, label: 'Form inputs', item: FormInputsTab },
  { value: 1, label: 'Radio', item: RadioTab },
  { value: 2, label: 'Checkboxes', item: CheckboxesTab },
  { value: 3, label: 'Toggles', item: TogglesTab },
  { value: 4, label: 'Date picker', item: DatePickerTab },
  { value: 5, label: 'Progress', item: ProgressTab },
  { value: 6, label: 'Code', item: CodeBlockTab },
  { value: 7, label: 'Modal', item: ModalTab },
  { value: 8, label: 'Menu', item: DropdownMenuTab },
  { value: 9, label: 'Loaders', item: LoadersTab },
  { value: 10, label: 'Button', item: ButtonTab },
  { value: 11, label: 'Toast', item: ToastTab },
  { value: 12, label: 'World Map', item: WorldMapTab },
];
