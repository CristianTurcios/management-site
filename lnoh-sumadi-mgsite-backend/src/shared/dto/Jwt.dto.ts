import { UserJwtDto } from './UserJwt.dto';

export class JwtDto {
    user: UserJwtDto;

    sub: string;

    iat: number;

    exp: number;
}
