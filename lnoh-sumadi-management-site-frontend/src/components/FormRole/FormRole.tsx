import React, { FC, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import Button from 'components/Button/Button';
import Loader from 'components/Loader/Loader';
import FeedBack from 'components/FeedBack/FeedBack';
import { getRoles, getRoles_Roles as RoleType } from 'apollo/queries/types/getRoles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import useOnClickOutside from 'components/clickOutSide/clickOutSide';
import GET_ROLES, { POST_ROLE, UPDATE_ROLE } from 'apollo/queries/roles';
import classes from './FormRole.module.css';

type FormData = {
    role: string
};

type FormRoleProps = {
  role: RoleType,
  onCreated(isOnCreateMode: boolean): void
  hide(data: boolean): void
}

const FormRole: FC<FormRoleProps> = (formProps) => {
  const ref = useRef(null);
  const { hide, role, onCreated } = formProps;
  const isOnCreateMode = !role;
  const [error, setError] = useState(false);

  const title = isOnCreateMode ? 'Add new Role' : 'Update Role';
  const { register, handleSubmit, errors } = useForm<FormData>({ mode: 'onBlur' });
  const [postRoleHandler, { loading: postRoleLoading, error: postRoleError }] = useMutation(
    POST_ROLE,
    {
      update(cache, { data: { postRole } }) {
        const data = cache.readQuery({ query: GET_ROLES }) as getRoles;
        const newData = [...data.Roles];
        newData.push(postRole);
        cache.writeQuery({ query: GET_ROLES, data: { Roles: newData } });
      },
    },
  );

  const [updateRoleHandler, { loading: updateRoleLoading, error: updateRoleError }] = useMutation(UPDATE_ROLE);

  useOnClickOutside(ref, () => { hide(true); });

  const onSubmit = async (data: FormData, event: any) => {
    try {
      if (isOnCreateMode) {
        await postRoleHandler({ variables: { role: data.role } });
      } else {
        await updateRoleHandler({ variables: { id: role.id, role: data.role } });
      }
      event.target.reset(); // reset after form submit
      hide(true);
      onCreated(isOnCreateMode);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className={`container--sumadi-modal ${classes.Modal}`}>
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div className="sumadi-modal" ref={ref}>
          <a className="modal__button-close" href={undefined} onClick={() => hide(true)}>
            <i><FontAwesomeIcon icon={faTimesCircle} /></i>
          </a>
          <div className="header--with-image">
            <div className="header--with-image__content">
              <h2>{title}</h2>
              <p>
                In order to
                {' '}
                {title}
                {' '}
                to the platform please fill the following information.
              </p>
            </div>
          </div>
          {
            (postRoleLoading || updateRoleLoading) && <Loader />
          }
          <div className="panel--content">
            <div className="col-12">
              {
                (postRoleError && error) && (
                <FeedBack
                  text={postRoleError.message}
                  isSuccess={false}
                  onClose={() => setError(false)}
                />
                )
              }
              {
                (updateRoleError && error) && (
                  <FeedBack
                    text={updateRoleError.message}
                    isSuccess={false}
                    onClose={() => setError(false)}
                  />
                )
              }
              <label htmlFor="role" className="form__label"><strong>Role</strong></label>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Role"
                  ref={register({ required: true })}
                  name="role"
                  defaultValue={role?.role}

                />
              </div>
              {errors.role && <div className="input-message input-message--error">Please enter a role</div>}
            </div>
            <div className="col-12">
              <Button text={title} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormRole;
