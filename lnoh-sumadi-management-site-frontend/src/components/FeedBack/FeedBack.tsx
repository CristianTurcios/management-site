import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';

type FeedBackProps = {
    text: string
    isSuccess: boolean;
    onClose(): void;
}

const FeedBack: FC<FeedBackProps> = (props) => {
  const { text, isSuccess, onClose } = props;

  return (
    <div className={`alert ${isSuccess ? 'alert--success' : 'alert--error'}`}>
      <p>{text}</p>
      <a href={undefined} onClick={onClose}>
        <FontAwesomeIcon icon={faTimesCircle} />
      </a>
    </div>
  );
};

export default FeedBack;
