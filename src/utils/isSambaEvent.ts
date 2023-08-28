import { receiveMessagesTypes } from '../types';

export const isSambaEvent = (eventName: string | symbol) => {
  return !!receiveMessagesTypes.find((type) => type === eventName);
};
