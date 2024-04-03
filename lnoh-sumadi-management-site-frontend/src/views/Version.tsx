import React, { FC } from 'react';

import Container from '../components/Container/Container';
import { version, name } from '../../package.json';

const Version: FC = () => {
  document.body.classList.add('login-body');
  return (
    <Container>

      <div className="header--with-image__content">
        <pre>{JSON.stringify({ name, version }, null, 2)}</pre>
      </div>

    </Container>
  );
};

export default Version;
