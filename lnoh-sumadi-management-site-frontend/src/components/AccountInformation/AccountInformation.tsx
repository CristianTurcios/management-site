import React, { FC } from 'react';
import school from 'assets/img/school.svg';

type AccountInformationProps = {
    id: string,
    name: string,
}

const AccountInformation: FC<AccountInformationProps> = (props) => {
  const { name, id } = props;

  return (
    <div className="row">
      <div className="col-12 list--institution">
        <div className="list__content">
          <img className="list__img" src={school} alt="school" />
          <div className="list__text">
            <div className="list__subtitle">Institution</div>
            <div className="list__title">{name}</div>
          </div>
        </div>
        <div className="list__content">
          <div className="list__text--secondary">
            <div className="list__subtitle">Institution name</div>
            <div className="list__title">{name}</div>
          </div>
          <div className="list__text--secondary">
            <div className="list__subtitle">Institution ID</div>
            <div className="list__title">{id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
