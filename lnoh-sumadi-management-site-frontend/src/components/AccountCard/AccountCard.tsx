import React, { FC, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import school from 'assets/img/school.svg';
import { useForm } from 'react-hook-form';
import { SessionContext } from 'context/SessionContext';
import { hasAccess } from 'services/AuthenticationService';

type AccountCardProps = {
  id: string,
  name: string,
  isEnabled: boolean,
  enabledAccount(id: string, isEnaled: boolean): void
}

type FormData = {
  isEnabled: boolean;
};

const AccountCard: FC<AccountCardProps> = (props) => {
  const {
    name, id, isEnabled, enabledAccount,
  } = props;
  const history = useHistory();
  const { session } = useContext(SessionContext);

  const {
    register, handleSubmit,
  } = useForm<FormData>({ mode: 'onBlur' });

  const redirect = () => {
    const path = `account/${id}`;
    history.push(path);
  };

  return (
    <div className="card">
      <div className="card__header">
        <img className="card__img" src={school} alt="school" />
        { hasAccess(session.user.role as string, ['Admin', 'Editor'])
        && (
        <div className="switch">
          <input
            type="checkbox"
            ref={register}
            name="isEnabled"
            checked={isEnabled}
            onChange={() => handleSubmit((data) => enabledAccount(id, data.isEnabled))()}
          />
          <span className="slider">
            <div className="switch__text switch__text--on">ON</div>
            <div className="switch__text switch__text--off">OFF</div>
          </span>
        </div>
        )}
      </div>
      <div className="card__body">
        <div className="card__subtitle">Institution</div>
        <div className="card__title">{name}</div>
      </div>
      <div className="card__footer">
        <button type="button" className="button--normal" onClick={redirect}>See more</button>
      </div>
    </div>
  );
};

export default AccountCard;
