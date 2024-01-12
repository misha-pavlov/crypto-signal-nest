import { createStyle } from '@gluestack-style/react';
import { hexToRgba } from '../../helpers';
import { colors } from '../colors';

export const SelectInput = createStyle({
  _web: {
    w: '$full',
  },
  pointerEvents: 'none',
  flex: 1,
  h: '$full',
  color: '$textLight900',
  props: {
    placeholderTextColor: hexToRgba(colors.white, 0.5),
  },
  _dark: {
    color: '$textDark50',
    props: {
      placeholderTextColor: '$textDark400',
    },
  },
});
