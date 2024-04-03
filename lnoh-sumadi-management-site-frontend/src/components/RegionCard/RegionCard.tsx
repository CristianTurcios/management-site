import React, { FC } from 'react';

interface RegionProps {
    region: string;
    count: number;
}
const RegionCard:FC<RegionProps> = (props) => {
  const { region, count } = props;
  return (
    <div className="card card--stats">
      <div className="card__body">
        <div className="card__title">{count}</div>
        <label htmlFor="card" className="label label--xs">Active</label>
      </div>
      <div className="card__footer">
        <div className="card__subtitle">{region}</div>
        <div className="card__title">Accounts</div>
      </div>
    </div>
  );
};

export default RegionCard;
