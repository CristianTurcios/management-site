import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Button from './Button';

storiesOf('components/Button', module).add(
  'Button', () => (
    <Button text="Submit" />
  ),
);
