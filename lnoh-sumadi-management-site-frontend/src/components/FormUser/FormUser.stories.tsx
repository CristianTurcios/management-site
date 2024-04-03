import * as React from 'react';
import { storiesOf } from '@storybook/react';
import useModal from 'helpers/useModal';
import FormUser from './FormUser';

const { toggle } = useModal();
storiesOf('components/FormUser', module).add(
  'FormUser', () => (
    <FormUser hide={toggle} />
  ),
);
