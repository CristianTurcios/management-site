import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const AddAccountButton: FC = () => {
  const history = useHistory();

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xl-3 card__container">
      <a
        className="card card--featured"
        onClick={() => history.push('/account/add')}
        href={undefined}
      >
        <div className="card__body">
          <i className="icon--xl"><FontAwesomeIcon icon={faPlus} /></i>
          <div className="card__title">Add new Institution Account</div>
        </div>
      </a>
    </div>
  );
};

export default AddAccountButton;
