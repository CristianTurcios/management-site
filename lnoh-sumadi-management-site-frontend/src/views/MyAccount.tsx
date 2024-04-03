import React, {
  ChangeEvent,
  FC, useContext, useState,
} from 'react';
import { useHistory } from 'react-router-dom';
import userAvatar from 'assets/img/bg-modal-keyboard.png';
import Loader from 'components/Loader/Loader';
import { useMutation, useQuery } from '@apollo/client';
import { CHANGE_USER_IMAGE, CHANGE_USER_PASSWORD, GET_USER_BY_ID } from 'apollo/queries/users';
import { getUserById } from 'apollo/queries/types/getUserById';
import { SessionContext } from 'context/SessionContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ChangePasswordFormValues } from 'interfaces/User';
import { Notification, NotificationType } from 'interfaces/Notification';
import { blobToBase64 } from 'helpers/Users';
import FeedBack from 'components/FeedBack/FeedBack';
import { logout } from 'services/AuthenticationService';

const MyAccount: FC = () => {
  const { session, setSession } = useContext(SessionContext);
  const history = useHistory();

  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: '',
    type: NotificationType.Empty,
  });
  const [imageAvatar, setImageAvatar] = useState<string>();

  const { loading, data } = useQuery<getUserById>(GET_USER_BY_ID, {
    variables: { id: session.user.id },
  });

  const [changePassword, { loading: changePasswordLoading }] = useMutation(CHANGE_USER_PASSWORD);
  const [changeUserImage, { loading: changeUserImageLoading }] = useMutation(CHANGE_USER_IMAGE, {
    onError(error) {
      setNotification({ show: true, message: error.message, type: NotificationType.Error });
    },
  });

  const {
    register, handleSubmit, errors, watch,
  } = useForm<ChangePasswordFormValues>({ mode: 'onBlur' });

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (formData) => {
    try {
      await changePassword({
        variables: {
          userId: session.user.id,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
      });
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
      history.push('/login', { changePassword: 'Password successfully changed. Please login again' });
    } catch (error) {
      setNotification({ show: true, message: error.message, type: NotificationType.Error });
    }
  };

  const handleFileChange = (avatarData: ChangeEvent<HTMLInputElement>) => {
    if (!avatarData.target.files?.length) return;

    const rawImage = avatarData.target.files[0];
    const imageType = rawImage.type;

    blobToBase64(rawImage, (imageOnBase64) => {
      setImageAvatar(`data:${imageType};base64,${imageOnBase64}`);
      changeUserImage({
        variables: {
          userId: session.user.id,
          image: `data:${imageType};base64,${imageOnBase64}`,
        },
      });
      setNotification({ show: true, message: 'Image successfully changed', type: NotificationType.Success });
    });
  };

  return (
    <section className="container--main container--main__no-sidebar">
      <div className="container">
        <div className="row">
          <div className="col-12 section--boxed">
            <div className="row">
              <div className="col-12 title-container title-container--with-components">
                <div className="title">My Account</div>
              </div>
              <div className="col-12">
                <div className="thumbnail header--with-image">
                  <div className=" image-upload">
                    <label className="cursorHover" htmlFor="file-input">
                      <img alt="avatar" src={imageAvatar || data?.User?.imageUrl || userAvatar} />
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
                            return size > 1024 ? 'The maximun supported file size is 1MB' : value;
                          },
                        })}
                      />
                    </label>

                  </div>

                  <div className="header--with-image__content">
                    <h2>{`${data?.User?.firstName || ''} ${data?.User?.lastName || ''}`}</h2>
                    <p>{data?.User?.email || ''}</p>
                    <p>{data?.User?.role.role || ''}</p>
                  </div>
                </div>
                <hr />
              </div>
              <div className="col-12 title-container title-container--with-components">
                <div className="title">Reset Password</div>
              </div>
              {(loading || changePasswordLoading || changeUserImageLoading) && <Loader />}
              <div className="col-lg-12">
                {
                 notification.show && (
                 <FeedBack
                   text={notification.message}
                   isSuccess={notification.type === NotificationType.Success}
                   onClose={() => setNotification({ ...notification, show: false })}
                 />
                 )
                }
                <form action="" onSubmit={handleSubmit(onSubmit)}>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="oldPassword" className="form__label"><strong>Old Password</strong></label>
                    <div className="input-container">
                      <input
                        type="password"
                        name="oldPassword"
                        placeholder=""
                        ref={register({
                          required: 'Old password Required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long',
                          },
                        })}
                      />
                    </div>
                    {errors.oldPassword
                      && <div className="input-message input-message--error">{errors.oldPassword.message}</div>}
                  </div>
                  <div className="col-12 col-lg-6">
                    <label htmlFor="password" className="form__label"><strong>New Password</strong></label>
                    <div className="input-container">
                      <input
                        type="password"
                        name="newPassword"
                        placeholder=""
                        ref={register({
                          required: 'New password Required',
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
                  <div className="col-12 col-lg-6">
                    <label htmlFor="confirmPassword" className="form__label">
                      <strong>Confirm New Password</strong>
                    </label>
                    <div className="input-container">
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder=""
                        ref={register({
                          required: 'Password Required',
                          validate: (value) => {
                            const oldPassword = watch('oldPassword');
                            const newPassword = watch('newPassword');
                            if (oldPassword === value) return 'New password and old password cannot be the same.';
                            if (newPassword !== value) return 'Password Mismatched';
                            return true;
                          },
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters long',
                          },
                        })}
                      />
                    </div>
                    {errors.confirmPassword && (
                      <div className="input-message input-message--error">{errors.confirmPassword.message}</div>
                    )}
                  </div>
                  <div className="col-12 col-lg-6">
                    <input type="submit" className="button--normal" value="Save Changes" />
                  </div>

                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAccount;
