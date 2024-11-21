import logger from '../../util/logger';
import wordToNumber from './wordToNumber';

export const voiceInputToNumber = (voiceInput: string): number | null => {
  if (!voiceInput) {
    return null;
  }
  const nativeParseResult = Number.parseInt(voiceInput, 10);
  logger.log('nativeParseResult', nativeParseResult);
  if (!Number.isNaN(nativeParseResult) && (nativeParseResult || voiceInput === '0' || voiceInput === 'zero')) {
    return nativeParseResult;
  }
  try {
    const res = wordToNumber(voiceInput);
    logger.log('parseResult', res);
    return res;
  } catch (e) {
    logger.error(e);
    return Number.parseInt(voiceInput, 10);
  }
};
