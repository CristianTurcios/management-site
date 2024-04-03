import React, { useContext, Suspense, lazy } from 'react';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import Loader from 'components/Loader/Loader';
import { isTokenValid } from 'helpers/authentication';
import { SessionContext } from 'context/SessionContext';
import { hasAccess } from 'services/AuthenticationService';
import PrivateRoute from 'components/CustomRoutes/AppLayoutRoute';

const Routes: React.FC = () => {
  const { session } = useContext(SessionContext);
  const hasSession = session.user.email !== '';
  const isAuthenticated = isTokenValid() && hasSession;

  const LoginView = lazy(() => import('./views/Login'));
  const VersionView = lazy(() => import('./views/Version'));
  const UsersView = lazy(() => import('./views/Users'));
  const MyAccountView = lazy(() => import('./views/MyAccount'));
  const NotFoundView = lazy(() => import('./views/Error'));
  const AccountsView = lazy(() => import('./views/Accounts'));
  const DashboardView = lazy(() => import('./views/Dashboard'));
  const AddAccountView = lazy(() => import('./views/AddAccount'));
  const EditAccountView = lazy(() => import('./views/EditAccount'));
  const ChangePasswordView = lazy(() => import('./views/ChangePassword'));
  const ForgotPasswordView = lazy(() => import('./views/ForgotPassword'));

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        {/* Private Routes */}
        <PrivateRoute path="/" exact />
        <PrivateRoute path="/dashboard" exact component={DashboardView} />

        <PrivateRoute path="/users" component={UsersView} />
        <Route path="/version" exact component={VersionView} />
        <PrivateRoute path="/accounts" exact component={AccountsView} />
        { hasAccess(session.user.role as string, ['Admin', 'Editor'])
        && <PrivateRoute path="/account/add" exact component={AddAccountView} />}
        <PrivateRoute path="/account/:id" exact component={EditAccountView} />
        <PrivateRoute path="/my-account" exact component={MyAccountView} />

        {/* ======================================================== */}
        {/* Authentication */}

        { !isAuthenticated
          ? <Route path="/login" exact component={LoginView} /> : <Redirect to={{ pathname: '/dashboard' }} /> }
        { !isAuthenticated
          ? <Route path="/forgot-password" exact component={ForgotPasswordView} />
          : <Redirect to={{ pathname: '/dashboard' }} /> }
        { !isAuthenticated
          ? <Route path="/change-password/:token" component={ChangePasswordView} />
          : <Redirect to={{ pathname: '/dashboard' }} /> }

        {/* Not Found */}
        <Route
          path="*"
          exact
          render={() => <NotFoundView status="404" message="Not Found! The page you are looking for doesn't exist." />}
        />
      </Switch>
    </Suspense>
  );
};

export default Routes;
