import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Container from './Container';

storiesOf('components/Container', module).add(
  'Container', () => (
    <Container>
      <p>Children</p>
    </Container>
  ),
);
