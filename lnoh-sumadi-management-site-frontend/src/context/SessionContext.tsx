import React, {
  createContext, FC, useState,
} from 'react';
import jwtDecode from 'jwt-decode';
import { Jwt } from '../interfaces/Jwt';

type SessionContextState = {
  session: Jwt;
  setSession: any;
}

interface SessionProviderProps {
}

const token = localStorage.getItem('token');
const tokenDecoded = token && jwtDecode(token) as Jwt;

const sessionInitialValue: Jwt = tokenDecoded || {
  exp: 0,
  iat: 0,
  sub: '',
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  },
};

const sessionContextValue: SessionContextState = {
  session: sessionInitialValue,
  setSession: '',
};

export const SessionContext = createContext<SessionContextState>(sessionContextValue);

export const SessionProvider: FC<SessionProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Jwt>(sessionInitialValue);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      { children }
    </SessionContext.Provider>
  );
};
