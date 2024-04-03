import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

type AccountMessageProps = {
  message: {
    title: string;
    subtitle: string,
    isSuccess: boolean,
  }
}

const AccountMessage: FC<AccountMessageProps> = (props) => {
  const { message: { title, subtitle, isSuccess } } = props;

  return (
    <div className="wizard-content">
      <div className="row placeholder-container">
        <div className="col-12">
          {
            isSuccess
              ? <i><FontAwesomeIcon icon={faCheckCircle} /></i>
              : <i><FontAwesomeIcon icon={faExclamationTriangle} /></i>
            }
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AccountMessage;
