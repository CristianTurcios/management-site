import { useContext } from 'react';
import { SessionContext } from '../context/SessionContext';

export const getTokenExpirationDate = (): Date => {
  const { session } = useContext(SessionContext);
  try {
    const date = new Date(0);
    date.setUTCSeconds(session.exp);
    return date;
  } catch (error) {
    return new Date(0);
  }
};

export const isTokenValid = (): boolean => {
  const date = getTokenExpirationDate();
  if (!date) { return false; }

  return (date.valueOf() > new Date().valueOf());
};
