import React, { FC } from 'react';
import logo from 'assets/img/logo.png';
import { useHistory } from 'react-router-dom';

type ErrorProps = {
  status: string,
  message: string,
}

const ErrorView: FC<ErrorProps> = (props) => {
  const { status, message } = props;
  const history = useHistory();

  document.body.classList.add('login-body');
  document.body.classList.add('error-body');

  const redirect = () => {
    document.body.classList.remove('login-body');
    document.body.classList.remove('error-body');
    history.push('/');
  };

  return (
    <section className="container--main container--main__no-margin">
      <div className="panel panel--medium">
        <a onClick={() => redirect()} href={undefined}>
          <img className="logo" src={logo} alt="logo" />
        </a>
        <hr />
        <h1>{status}</h1>
        <p>{message}</p>
        <div className="row">
          <div className="col-12 col-lg-12">
            <button type="button" className="button--normal" onClick={() => redirect()}>Go Home</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ErrorView;
