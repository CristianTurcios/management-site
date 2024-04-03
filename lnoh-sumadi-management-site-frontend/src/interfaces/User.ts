export type Role = {
  id: number;
  role: string
}

export type User = {
  id: string;
  firstName: string;
  lastName?: string;
  email: string;
  role: string | Role;
  imageUrl?: string;
}

export type TokenDecoded = {
  user: User;
}

export type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  repeatPassword: string;
  role: string;
  status: boolean;
  image: FileList;
};
export interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string
}

export interface FormUserProps {
  hide: any;
  user?: User
  refetch?: any
}
