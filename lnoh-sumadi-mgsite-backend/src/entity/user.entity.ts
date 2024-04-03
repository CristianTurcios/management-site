/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsNotEmpty, IsEmail } from 'class-validator';
import {
  Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn,
  CreateDateColumn, JoinColumn, ManyToOne,
} from 'typeorm';
import Role from './role.entity';

@Entity()
export default class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsNotEmpty()
    firstName: string;

    @Column()
    @IsNotEmpty()
    lastName: string;

    @Column()
    @IsNotEmpty()
    password: string;

    @Column({ nullable: true, default: '' })
    imageUrl: string;

    @ManyToOne((type) => Role, (rol) => rol.id, { eager: true })
    @JoinColumn()
    role: Role;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    resetTokenExpires: Date;

    @Column({ nullable: true })
    resetToken: string;

    @Column({ nullable: true })
    passwordReset: Date;

    @Column({ nullable: true })
    verified: Date;

    @Column()
    @IsNotEmpty()
    acceptTerms: boolean;

    @Column()
    @IsNotEmpty()
    status: boolean;

    @Column({ nullable: true })
    verificationToken: string;

    @Column({ nullable: true })
    isVerified: boolean;
}
