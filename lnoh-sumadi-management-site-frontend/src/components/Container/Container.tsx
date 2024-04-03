import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import logo from 'assets/img/logo.png';

const Container: FC = (props) => {
  const { children } = props;
  const history = useHistory();

  return (
    <section className="container--main container--main__no-margin">
      <div className="panel panel--xsmall">
        <a onClick={() => history.push('/login')} href={undefined}>
          <img className="logo" src={logo} alt="logo" />
        </a>
        <hr />
        { children }
      </div>
    </section>
  );
};

export default Container;
