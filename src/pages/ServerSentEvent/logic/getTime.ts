import { getDateParts } from '@src/common/utils/getDateParts';

export function getTime(dateStr: string) {
  const date = new Date(dateStr);

  const { hour, minute, second } = getDateParts(date);

  const time = `${hour}:${minute}:${second}`;

  return time;
}
