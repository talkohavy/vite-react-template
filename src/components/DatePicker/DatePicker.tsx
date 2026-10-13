import { DatePicker as DatePickerOriginal, useDatePicker, type DateValue } from '@ark-ui/react/date-picker';
import { Portal } from '@ark-ui/react/portal';
import clsx from 'clsx';
import CalendarIcon from '../svgs/CalendarIcon';
import DownArrow from '../svgs/DownArrow';
import styles from './DatePicker.module.scss';

const {
  RootProvider,
  Label,
  Control,
  Input,
  Trigger,
  ClearTrigger,
  Positioner,
  Content,
  // YearSelect,
  // MonthSelect,
  View,
  Context,
  ViewControl,
  PrevTrigger,
  NextTrigger,
  RangeText,
  ViewTrigger,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableCellTrigger,
} = DatePickerOriginal;

type DatePickerProps = {
  value: Array<DateValue>;
  setValue: (value: any) => void;
  selectionMode?: 'single' | 'range' | 'multiple';
  label?: string;
  disabled?: boolean;
  /**
   * @default true
   */
  closeOnSelect?: boolean;
  /**
   * Whether the calendar should have a fixed number of weeks. This renders the calendar with 6 weeks instead of 5 or 6.
   *
   * @default false
   */
  fixedWeeks?: boolean;
  // minDateToBeSelected?: DateValue;
  maxDateToBeSelected?: DateValue;
};

export default function DatePicker(props: DatePickerProps) {
  const {
    value,
    setValue,
    label,
    selectionMode = 'single',
    disabled,
    closeOnSelect,
    fixedWeeks,
    maxDateToBeSelected,
  } = props;

  const datePicker = useDatePicker({
    selectionMode,
    startOfWeek: 0,
    disabled,
    closeOnSelect,
    fixedWeeks,
    max: maxDateToBeSelected,
    value,
    onValueChange(details) {
      setValue(details.value);
    },
    // min: minDateToBeSelected,
    // maxView: 'day',
  });

  function handleClearValue() {
    datePicker.clearValue();
  }

  return (
    <>
      {Boolean(value.length) && (
        <button type='button' className='self-start' onClick={handleClearValue}>
          Clear
        </button>
      )}

      <RootProvider value={datePicker}>
        {label && <Label>{label}</Label>}

        <Control className={styles.control}>
          <Input index={0} className={styles.input} />
          {selectionMode === 'range' && <Input index={1} />}

          <Trigger className={clsx(styles.trigger, styles.controlTrigger)}>
            <CalendarIcon />
          </Trigger>

          <ClearTrigger>Clear</ClearTrigger>
        </Control>

        {/* <DatePickerOriginal.PresetTrigger value='last7Days'>Last 7 days</DatePickerOriginal.PresetTrigger>
        <DatePickerOriginal.PresetTrigger value='thisMonth'>This month</DatePickerOriginal.PresetTrigger>
        <DatePickerOriginal.PresetTrigger value='last30Days'>Last 30 days</DatePickerOriginal.PresetTrigger>
        <DatePickerOriginal.PresetTrigger value='thisYear'>This year</DatePickerOriginal.PresetTrigger> */}

        <Portal>
          <Positioner>
            <Content className={styles.content}>
              {/* <YearSelect /> */}

              {/* <MonthSelect /> */}

              <View view='day' className={styles.view}>
                <Context>
                  {(datePicker) => (
                    <>
                      <ViewControl className={styles.viewControl}>
                        <PrevTrigger className={clsx(styles.trigger, styles.prevNextTrigger)}>
                          <DownArrow className='rotate-90 size-3.5' />
                        </PrevTrigger>

                        <ViewTrigger className={clsx(styles.trigger, styles.viewTrigger)}>
                          <RangeText />
                        </ViewTrigger>

                        <NextTrigger className={clsx(styles.trigger, styles.prevNextTrigger)}>
                          <DownArrow className='-rotate-90 size-3.5' />
                        </NextTrigger>
                      </ViewControl>

                      <Table className={styles.table}>
                        <TableHead>
                          <TableRow>
                            {datePicker.weekDays.map((weekDay, id) => (
                              <TableHeader key={id} className={styles.tableHeader}>
                                {weekDay.short}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {datePicker.weeks.map((week, id) => (
                            <TableRow key={id}>
                              {week.map((day, id) => (
                                <TableCell key={id} value={day} className={styles.tableCell}>
                                  <TableCellTrigger className={clsx(styles.trigger, styles.tableCellTrigger)}>
                                    {day.day}
                                  </TableCellTrigger>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </Context>
              </View>

              <View view='month' className={styles.view}>
                <Context>
                  {(datePicker) => (
                    <>
                      <ViewControl className={styles.viewControl}>
                        <PrevTrigger className={clsx(styles.trigger, styles.prevNextTrigger)}>
                          <DownArrow className='rotate-90 size-3.5' />
                        </PrevTrigger>

                        <ViewTrigger className={clsx(styles.trigger, styles.viewTrigger)}>
                          <RangeText />
                        </ViewTrigger>

                        <NextTrigger className={clsx(styles.trigger, styles.prevNextTrigger)}>
                          <DownArrow className='-rotate-90 size-3.5' />
                        </NextTrigger>
                      </ViewControl>

                      <Table className={styles.table}>
                        <TableBody>
                          {datePicker.getMonthsGrid({ columns: 4, format: 'short' }).map((months, id) => (
                            <TableRow key={id}>
                              {months.map((month, id) => (
                                <TableCell key={id} value={month.value} className={styles.tableCell}>
                                  <TableCellTrigger
                                    className={clsx(styles.trigger, styles.tableCellTrigger, styles.fontBold)}
                                  >
                                    {month.label}
                                  </TableCellTrigger>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </Context>
              </View>

              <View view='year' className={styles.view}>
                <Context>
                  {(datePicker) => (
                    <>
                      <ViewControl className={styles.viewControl}>
                        <PrevTrigger className={clsx(styles.trigger, styles.prevNextTrigger)}>
                          <DownArrow className='rotate-90 size-3.5' />
                        </PrevTrigger>

                        <ViewTrigger
                          className={clsx(styles.trigger, styles.viewTrigger)}
                          onClick={(e) => {
                            e.preventDefault();
                            datePicker.setView('day');
                          }}
                        >
                          <RangeText />
                        </ViewTrigger>

                        <NextTrigger className={clsx(styles.trigger, styles.prevNextTrigger)}>
                          <DownArrow className='-rotate-90 size-3.5' />
                        </NextTrigger>
                      </ViewControl>

                      <Table className={styles.table}>
                        <TableBody>
                          {datePicker.getYearsGrid({ columns: 4 }).map((years, id) => (
                            <TableRow key={id}>
                              {years.map((year, id) => (
                                <TableCell key={id} value={year.value} className={styles.tableCell}>
                                  <TableCellTrigger
                                    className={clsx(styles.trigger, styles.tableCellTrigger, styles.fontBold)}
                                  >
                                    {year.label}
                                  </TableCellTrigger>
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </>
                  )}
                </Context>
              </View>
            </Content>
          </Positioner>
        </Portal>
      </RootProvider>
    </>
  );
}
