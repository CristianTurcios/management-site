import React, { FC } from 'react';
import userAvatar from 'assets/img/bg-modal-keyboard.png';

type LatestUserProps = {
  imageUrl: string | null,
  firstName: string,
  lastName: string,
  createdAt: string
}

const LatestUser: FC<LatestUserProps> = (props) => {
  const {
    firstName, lastName, imageUrl, createdAt,
  } = props;

  const createdAtFormat = new Date(createdAt);
  const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(createdAtFormat);
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(createdAtFormat);
  const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(createdAtFormat);
  const formatedDay = `${day} ${month} ${year}`;

  return (
    <>
      <img className="list__img" src={imageUrl || userAvatar} alt="user" />
      <div className="list__text">
        <div className="list__title">{`${firstName} ${lastName}`}</div>
        <div className="list__subtitle">
          <strong>Member since</strong>
          {formatedDay}
        </div>
      </div>
    </>
  );
};

export default LatestUser;
