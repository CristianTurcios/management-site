import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { Notification, NotificationType } from 'interfaces/Notification';
import FeedBack from 'components/FeedBack/FeedBack';
import Container from '../components/Container/Container';
import Button from '../components/Button/Button';
import Loader from '../components/Loader/Loader';
import { SessionContext } from '../context/SessionContext';
import { authenticate } from '../services/AuthenticationService';

type FormData = {
  email: string;
  password: string;
};

type Message = {
  changePassword?: string;
}
const LoginView: FC = () => {
  const title = 'Welcome';
  const subtitle = 'Please add your credentials to continue.';
  document.body.classList.add('login-body');

  const history = useHistory<Message>();
  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onBlur' });
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: '',
    type: NotificationType.Empty,
  });
  const { setSession } = useContext(SessionContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (history?.location?.state?.changePassword) {
      setNotification({ show: true, message: history.location.state.changePassword, type: NotificationType.Success });
      window.history.replaceState({ changePassword: '' }, '');
    }
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const userData = await authenticate(data);
      setSession(userData);
      history.push('/dashboard');
    } catch (error) {
      setLoading(false);
      setNotification({ show: true, message: error.message, type: NotificationType.Error });
    }
  };

  return (
    <Container>
      {loading && <Loader /> }
      <div className="header--with-image__content">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="panel--content">
        {
          notification.show && (
          <FeedBack
            text={notification.message}
            isSuccess={notification.type === NotificationType.Success}
            onClose={() => setNotification({ ...notification, show: false })}
          />
          )
        }
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-12 col-lg-12">
              <div className="form-group">
                <label htmlFor="email" className="form__label"><strong>Username</strong></label>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    ref={register({
                      required: 'Requerid',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid Email Format',
                      },
                    })}
                  />
                </div>
                {errors.email && <div className="input-message input-message--error">{errors.email.message}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="password" className="form__label"><strong>Password</strong></label>
                <div className="input-container">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    name="password"
                    ref={register({ required: true })}
                  />
                </div>
                {errors.password && <div className="input-message input-message--error">Password Required</div>}
              </div>
              <div className="panel--footer">
                <div className="form__row row">
                  <div className="col-12 col-lg-12 forgot-password">
                    <a
                      className="login-link"
                      onClick={() => history.push('/forgot-password')}
                      href={undefined}
                    >
                      forgot password?
                    </a>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-lg-12">
                    <Button text="Log in" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default LoginView;
