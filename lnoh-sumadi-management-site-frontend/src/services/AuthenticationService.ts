import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { TokenDecoded } from '../interfaces/User';

const baseUrl = process.env.REACT_APP_API_URL;

type Login = {
    email: string;
    password: string;
};

export const authenticate = async ({ email, password }: Login) => {
  try {
    const res = await axios.post(`${baseUrl}/authentication/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    const decoded = jwtDecode(res.data.token) as TokenDecoded;
    return decoded;
  } catch (error) {
    throw new Error(error?.response?.data?.message || 'Email or password invalid');
  }
};

export const forgotPassword = async (email: string): Promise<boolean> => {
  try {
    await axios.post(`${baseUrl}/authentication/forgot-password`, { email });
    return true;
  } catch (error) {
    return false;
  }
};

export const changePassword = async (password: string, confirmPassword: string, token: string): Promise<boolean> => {
  try {
    await axios.post(`${baseUrl}/authentication/change-password/${token}`, {
      password,
      confirmPassword,
    });
    return true;
  } catch (error) {
    return false;
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};

export const protectedRoute = async () => {
  const res = await axios.get(`${baseUrl}/protected`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    withCredentials: true,
  });
  if (!res) throw new Error('An error ocurred when logging out');

  return true;
};

export const hasAccess = (
  userRole: string,
  allowedRoles: Array<string>,
): boolean => allowedRoles.indexOf(userRole) !== -1;
