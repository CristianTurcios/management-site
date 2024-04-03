export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: object;
    createdAt: Date;
    updatedAt: Date;
    acceptTerms: boolean;
    isVerified: boolean;
    imageUrl: string;
}
