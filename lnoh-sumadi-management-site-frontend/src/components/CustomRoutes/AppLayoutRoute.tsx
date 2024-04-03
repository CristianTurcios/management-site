import React, { useContext } from 'react';
import {
  Route, Redirect, RouteProps, useHistory, NavLink,
} from 'react-router-dom';
import logo from 'assets/img/logo.png';
import { isTokenValid } from 'helpers/authentication';
import { SessionContext } from 'context/SessionContext';
import { hasAccess, logout } from 'services/AuthenticationService';

const PrivateRoute = (props: RouteProps) => {
  const {
    component, exact, location, path, render, sensitive, strict,
  } = props;
  const history = useHistory();
  const { session, setSession } = useContext(SessionContext);
  document.body.classList.remove('login-body');

  if (location) {
    if (!isTokenValid()) {
      return (
        <Redirect to={{ pathname: '/login' }} />
      );
    }

    if (location.pathname === '/') {
      return (
        <Redirect to={{ pathname: '/dashboard' }} />
      );
    }
  }

  const signOff = async () => {
    try {
      setSession({
        exp: 0,
        iat: 0,
        sub: '',
        user: {
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          role: '',
        },
      });
      await logout();
      history.push('/');
    } catch (error) {
      throw new Error('Error in signOFf');
    }
  };

  const myAccount = () => {
    lostFocus();
    history.push('/my-account');
  };

  const lostFocus = () => {
    const checkbox = document.getElementById('status') as HTMLInputElement;
    checkbox.checked = false;
  };
  return (
    <>
      <div className="container header header--main">
        <div className="col-12">
          <div className="row">
            <div className="col-2">
              <a className="header--main__logo" href="/">
                <img className="logo" src={logo} alt="SUMADI" />
              </a>
            </div>
            <div className="col-8">
              <nav className="nav--main">
                <ul>
                  <li><NavLink to="/dashboard" activeClassName="nav--main__item--selected">Dashboard</NavLink></li>
                  {
                    hasAccess(session.user.role as string, ['Admin', 'Editor', 'Viewer'])
                    && <li><NavLink to="/users" activeClassName="nav--main__item--selected">Users</NavLink></li>
                  }
                  {
                    hasAccess(session.user.role as string, ['Admin', 'Editor', 'Viewer'])
                    && <li><NavLink to="/accounts" activeClassName="nav--main__item--selected">Accounts</NavLink></li>
                  }
                </ul>
              </nav>
            </div>
            <div className="col-2">
              <nav className="nav--secondary">
                <div className="dropdown-white-xs dropdown--transparent">
                  <input id="status" type="checkbox" />
                  <label htmlFor="status">
                    <h5>{`${session.user.firstName} ${session.user.lastName}`}</h5>
                    <i className="fas fa-chevron-down" />
                  </label>
                  <ul>
                    <li className="selected-category">
                      <span role="button" onKeyPress={myAccount} tabIndex={0} onClick={myAccount}>My Account</span>
                    </li>
                    <li><span role="button" onKeyPress={signOff} tabIndex={-1} onClick={signOff}>Log out</span></li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <Route
        component={component}
        exact={exact}
        location={location}
        path={path}
        render={render}
        sensitive={sensitive}
        strict={strict}
      />
    </>
  );
};

export default PrivateRoute;
