import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useHistory } from 'react-router-dom';
import Button from '../components/Button/Button';
import { changePassword } from '../services/AuthenticationService';
import Container from '../components/Container/Container';
import Loader from '../components/Loader/Loader';

type FormValues = {
    password: string;
    newPassword: string;
};
interface Token {
    token: string;
}

const ChangePasswordView: FC = () => {
  document.body.classList.add('login-body');
  const [title, setTitle] = useState('Add New Password');
  const [subtitle, setSubtitle] = useState('Please fill the following fields to reset your password.');
  const [successResponse, setSuccessResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token } = useParams<Token>();
  const history = useHistory();
  const {
    register, handleSubmit, errors, watch,
  } = useForm<FormValues>({ mode: 'onBlur' });

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    const status = await changePassword(data.password, data.newPassword, token);

    if (status) {
      setTitle('Successful Password Reset');
      setSubtitle('You can now use your new password to log in into your account.');
      setSuccessResponse(true);
    } else {
      setSuccessResponse(false);
      setSubtitle('The token is invalid or has expired.');
    }
    setLoading(false);
  };

  return (
    <Container>
      {loading && <Loader />}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="header--with-image__content">
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {
          !successResponse
            ? (
              <>
                <div className="panel--content">
                  <div className="row">
                    <div className="col-12 col-lg-12">
                      <label htmlFor="password" className="form__label">
                        <strong>New Password</strong>
                      </label>
                      <div className="input-container">
                        <input
                          type="password"
                          placeholder="Password"
                          name="password"
                          ref={register({
                            required: 'Password Required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters long',
                            },
                          })}
                        />
                      </div>
                      {errors.password
                        && <div className="input-message input-message--error">{errors.password.message}</div>}
                    </div>
                    <div className="col-12 col-lg-12">
                      <label htmlFor="newPassword" className="form__label">
                        <strong>Confirm New Password</strong>
                      </label>
                      <div className="input-container">
                        <input
                          type="password"
                          placeholder="New Password"
                          name="newPassword"
                          ref={register({
                            required: 'Password Required',
                            validate: (value) => value === watch('password')
                              || 'Password Mismatched',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters long',
                            },
                          })}
                        />
                      </div>
                      {errors.newPassword
                        && <div className="input-message input-message--error">{errors.newPassword.message}</div>}
                    </div>
                  </div>
                </div>
                <div className="panel--footer">
                  <div className="row">
                    <div className="col-12 col-lg-12">
                      <Button text="Change My Password" />
                    </div>
                  </div>
                </div>
              </>
            )
            : (
              <div className="panel--footer">
                <div className="row">
                  <div className="col-12 col-lg-12">
                    <button type="button" className="button--normal" onClick={() => history.push('/login')}>
                      Log in
                    </button>
                  </div>
                </div>
              </div>
            )
          }
      </form>
    </Container>
  );
};

export default ChangePasswordView;
