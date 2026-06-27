import type { MessageStateValues } from './logic/constants';

export type MessageLogEntry = {
  id: string;
  direction: MessageStateValues;
  time: Date;
  data: any;
};
