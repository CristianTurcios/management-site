import { User } from './User';

export interface Jwt {
    exp: number;
    iat: number;
    sub: string;
    user: User;
}
