import React, { FC } from 'react';

const Footer: FC = () => (
  <div className="loader-container loader-container--fullscreen">
    <div className="loader">
      <div className="loader-dot" />
      <div className="loader-dot" />
      <div className="loader-dot" />
      <div className="loader-dot" />
      <div className="loader-dot" />
    </div>
    <div className="loader-text">Loading...</div>
  </div>
);
export default Footer;
