import { receiveMessagesTypes } from '../types';
export const isSambaEvent = (eventName) => {
    return !!receiveMessagesTypes.find((type) => type === eventName);
};
