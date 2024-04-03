import React, { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import Button from '../components/Button/Button';
import { forgotPassword } from '../services/AuthenticationService';
import Container from '../components/Container/Container';
import Loader from '../components/Loader/Loader';

type FormData = {
  email: string;
};

const ForgotPasswordView: FC = () => {
  const title = 'Forgot Password?';
  const subtitle = 'Please add your the following information to recover your access.';
  const successMessage = 'Please check your email inbox, we sent you a link to reset your password!';

  const [successResponse, setSuccessResponse] = useState(false);
  const [errorResponse, setErrorResponse] = useState(false);
  const [loading, setLoading] = useState(false);
  document.body.classList.add('login-body');

  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onBlur' });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const status = await forgotPassword(data.email);
    if (status) {
      setSuccessResponse(true);
      setErrorResponse(false);
    } else {
      setErrorResponse(true);
      setSuccessResponse(false);
    }
    setLoading(false);
  };

  return (
    <Container>
      {loading && <Loader />}
      <div className="header--with-image__content">
        <div className="col-12 justify-content-center modal-footer">
          <NavLink to="/" className="close--button-modal">
            Go back
            {' '}
            <FontAwesomeIcon icon={faArrowCircleLeft} />
          </NavLink>
        </div>
        <hr />
        <h3>{title}</h3>
        {
          !successResponse
            ? <p>{subtitle}</p>
            : <p>{successMessage}</p>
        }
      </div>
      <div className="panel--content">
        <form onSubmit={handleSubmit(onSubmit)} id="forgorPassword">
          <div className="row">
            <div className="col-12 col-lg-12">
              <div className="form-group">
                <label htmlFor="email" className="form__label"><strong>Email</strong></label>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    ref={register({
                      required: 'Email Required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Please introduce a valid email',
                      },
                    })}
                  />
                </div>
                {errors.email && <div className="input-message input-message--error">{errors.email.message}</div>}
                {
                      errorResponse
                      && (
                      <div className="input-message input-message--error">
                        We can&apos;t find your email address, please try again!
                      </div>
                      )
                    }
              </div>
              <div className="panel--footer">
                <div className="row">
                  {
                        !successResponse
                        && (
                          <div className="col-12 col-lg-12">
                            <Button text="Send Recovery Link" />
                          </div>
                        )
                      }
                  {
                        successResponse
                        && (
                          <div className="col-12 col-lg-12">
                            <a
                              className="login-link resend-link"
                              href={undefined}
                              onClick={handleSubmit(onSubmit)}
                            >
                              Resend Link
                            </a>
                          </div>
                        )
                      }
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default ForgotPasswordView;
