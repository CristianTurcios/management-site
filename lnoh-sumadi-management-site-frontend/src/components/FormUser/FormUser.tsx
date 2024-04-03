import React, {
  ChangeEvent, FC, useState, useEffect, useRef,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQuery } from '@apollo/client';
import { FormUserProps, FormValues, Role } from 'interfaces/User';
import GET_ROLES from 'apollo/queries/roles';
import { getRoles } from 'apollo/queries/types/getRoles';
import { Notification, NotificationType } from 'interfaces/Notification';
import { CREATE_USER, UPDATE_USER } from 'apollo/queries/users';
import { blobToBase64, isBase64 } from 'helpers/Users';
import useOnClickOutside from 'components/clickOutSide/clickOutSide';
import avatar from 'assets/img/users/iconAvatar.png';
import Loader from 'components/Loader/Loader';
import classes from './FormUser.module.css';

const IMAGE_KB_SIZE_LIMIT = 1024;
const FormUser: FC<FormUserProps> = (formProps) => {
  const ref = useRef(null);
  const { hide, user, refetch } = formProps;
  const isOnCreateMode = !user;
  const title = isOnCreateMode ? 'Add new user' : 'Update user';

  const [imageAvatar, setImageAvatar] = useState<string>(avatar);
  const [showNotification, setNotification] = useState<Notification>({
    show: false,
    message: '',
    type: NotificationType.Empty,
  });

  const [postUser, { loading: postUserLoading }] = useMutation(CREATE_USER);
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);
  const { loading: rolesLoading, data: rolesData } = useQuery<getRoles>(GET_ROLES);

  useOnClickOutside(ref, () => { hide(true); });

  const {
    register, handleSubmit, errors, watch, setValue,
  } = useForm<FormValues>({ mode: 'onBlur' });

  useEffect(() => {
    if (!isOnCreateMode && user) {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(user)) {
        setValue(key, value);
      }
      const userRole = user.role as Role;
      setValue('role', `${userRole.id}`);
      const image = user.imageUrl;
      setImageAvatar(image || avatar);
    }
  }, [rolesLoading]);

  const onSubmitValidation: SubmitHandler<FormValues> = async (data) => {
    setNotification({ show: false, message: '', type: NotificationType.Empty });

    const userRequest = isOnCreateMode ? createUser(data) : updateUserData(data);

    userRequest.then(() => {
      const message = isOnCreateMode ? 'Created' : 'Updated';
      setNotification({ show: true, message: `Success: User Successfully ${message}`, type: NotificationType.Success });
      refetch(true);
    }).catch((err: Error) => {
      setNotification({ show: true, message: `Error: ${err.message}`, type: NotificationType.Error });
      refetch(false);
    });
  };

  const createUser = (data: FormValues) => {
    const image = data.image.length ? imageAvatar : '';
    return postUser({
      variables: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.repeatPassword,
        acceptTerms: true,
        role: parseInt(data.role, 10),
        status: data.status,
        imageUrl: image,
      },
    });
  };

  const updateUserData = (userData: FormValues) => {
    const image = isBase64(imageAvatar) ? imageAvatar : '';
    return updateUser({
      variables: {
        id: user && user.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: parseInt(userData.role, 10),
        status: userData.status,
        imageUrl: image,
      },
    });
  };

  const handleFileChange = (avatarData: ChangeEvent<HTMLInputElement>) => {
    if (avatarData.target.files?.length) {
      const rawImage = avatarData.target.files[0];
      const imageType = rawImage.type;

      blobToBase64(rawImage, (imageOnBase64) => setImageAvatar(`data:${imageType};base64,${imageOnBase64}`));
    }
  };

  return (
    <div className={`container--sumadi-modal ${classes.Modal}`}>
      <form action="" onSubmit={handleSubmit(onSubmitValidation)}>
        <div className="sumadi-modal" ref={ref}>
          <a className="modal__button-close" onClick={hide} href={undefined}>
            <FontAwesomeIcon icon={faTimesCircle} />
          </a>
          <div className=" thumbnail header--with-image image-upload">
            <label className="cursorHover" htmlFor="file-input">
              <img alt="avatar" src={imageAvatar} />
              <input
                id="file-input"
                type="file"
                accept="image/png, image/jpeg"
                name="image"
                className="input--uploader"
                onChange={handleFileChange}
                ref={register({
                  required: false,
                  validate: (value) => {
                    let size = 0;
                    if (value.length) {
                      size = value[0].size / 1000;
                    }
                    return size > IMAGE_KB_SIZE_LIMIT ? 'The maximun supported file size is 1MB' : value;
                  },
                })}
              />
            </label>

            <div className="header--with-image__content">
              <h2>{title}</h2>
              <p>{`In order to ${title} to the platform please fill the following information.`}</p>
            </div>
          </div>
          {showNotification.show && (
            <div className={`alert alert--${showNotification.type}`}>
              <p>{showNotification.message}</p>
            </div>
          )}
          {(postUserLoading || updateUserLoading || rolesLoading) && <Loader />}
          {errors.image && <p className="error--message">{errors.image.message}</p>}

          {(showNotification.type === NotificationType.Empty || showNotification.type === NotificationType.Error) && (
            <>
              <div className="panel--content">
                <div className="col-12">
                  <label htmlFor="firstName" className="form__label"><strong>First Name</strong></label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      ref={register({ required: true })}
                    />
                  </div>
                  {errors.firstName && <div className="input-message input-message--error">First Name Required</div>}
                </div>
                <div className="col-12">
                  <label htmlFor="name" className="form__label"><strong>Last Name</strong></label>
                  <div className="input-container">
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Name"
                      ref={register({ required: true })}
                    />
                  </div>
                  {errors.lastName && <div className="input-message input-message--error">Last Name Required</div>}
                </div>
                <div className="col-12">
                  <label htmlFor="email" className="form__label"><strong>Email</strong></label>
                  <div className="input-container">
                    <input
                      type="mail"
                      name="email"
                      placeholder="Email"
                      ref={register({
                        required: 'Email Required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid Email',
                        },
                      })}
                    />
                  </div>
                  {errors.email && <div className="input-message input-message--error">{errors.email.message}</div>}
                </div>
                {isOnCreateMode && (
                  <div className="col-12">
                    <label htmlFor="password" className="form__label"><strong>Password</strong></label>
                    <div className="input-container">
                      <input
                        type="password"
                        name="password"
                        placeholder="Password"
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
                )}
                {isOnCreateMode && (
                  <div className="col-12">
                    <label htmlFor="repeatPassword" className="form__label"><strong>Repeat Password</strong></label>
                    <div className="input-container">
                      <input
                        type="password"
                        name="repeatPassword"
                        placeholder="Repeat Password"
                        ref={register({
                          required: 'Password Required',
                          validate: (value) => value === watch('password') || 'Password Mismatched',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long',
                          },
                        })}
                      />
                    </div>
                    {errors.repeatPassword
                      && <div className="input-message input-message--error">{errors.repeatPassword.message}</div>}
                  </div>
                )}
                <div className="col-12">
                  <label htmlFor="role" className="form__label"><strong>Role</strong></label>
                  <div className="input-container">
                    <select name="role" ref={register} className="mr-0">
                      {rolesData && rolesData.Roles?.map(
                        (role) => <option key={role?.id} value={role?.id}>{role?.role}</option>,
                      )}
                    </select>
                  </div>
                </div>
                <div className="col-12">
                  <label htmlFor="status" className="form__label"><strong>Active</strong></label>
                  <div className="switch">
                    <input type="checkbox" name="status" defaultChecked ref={register} />
                    <span className="slider">
                      <div className="switch__text switch__text--on">ON</div>
                      <div className="switch__text switch__text--off">OFF</div>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-12 justify-content-center modal-footer">
                <input type="submit" className="button--normal" value={title} name="add" />
              </div>
            </>
          )}
          {showNotification.type === NotificationType.Success && (
            <div className="col-12 justify-content-center modal-footer">
              <button type="submit" className="button--normal" onClick={hide} name="close">Close</button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormUser;
