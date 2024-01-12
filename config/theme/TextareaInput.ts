import { createStyle } from '@gluestack-style/react';
import { hexToRgba } from '../../helpers';
import { colors } from '../colors';

export const TextareaInput = createStyle({
  p: '$2',
  color: '$textLight900',
  textAlignVertical: 'top',
  flex: 1,
  props: {
    // @ts-ignore
    multiline: true,
    placeholderTextColor: hexToRgba(colors.white, 0.5),
  },
  _dark: {
    color: '$textDark50',
    props: {
      placeholderTextColor: '$textDark400',
    },
  },
  _web: {
    'cursor': 'text',
    ':disabled': {
      cursor: 'not-allowed',
    },
  },
});
