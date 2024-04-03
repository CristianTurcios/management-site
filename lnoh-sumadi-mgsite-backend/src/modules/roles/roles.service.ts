import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';
import Role from '../../entity/role.entity';
import { IRole } from './interfaces/role.interface';

@Injectable()
export class RolesService {
  constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
  ) {
    // Constructor
  }

  async getRoles(): Promise<any> {
    const roles = await this.roleRepository.find();
    return roles;
  }

  async getRoleById(id: number): Promise<IRole> {
    const role = await this.roleRepository.findOne({ id });
    if (!role) { throw new Error('Role not found'); }

    return role;
  }

  async postRole(roleName: string): Promise<IRole> {
    let role = await this.roleRepository.findOne({ role: roleName });

    if (role) { throw new Error('Role already taken'); }

    role = new Role();
    role.role = roleName;

    const errors = await validate(role);
    if (errors.length > 0) { throw new Error(errors.toString()); }
    try {
      await this.roleRepository.save(role);
      return role;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }

  async updateRole(id: number, roleName: string): Promise<IRole> {
    const role = await this.roleRepository.findOne({ id });

    if (!role) { throw new Error('Role not found'); }

    const validateRoleName = await this.roleRepository.findOne({ role: roleName });

    if (validateRoleName) { throw new Error('Role already taken'); }

    Object.assign(role, { role: roleName });

    try {
      await this.roleRepository.save(role);
      return role;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }

  async deleteRole(id: number): Promise<IRole> {
    const role = await this.roleRepository.findOne({ id });

    if (!role) { throw new Error('Role not found'); }

    try {
      await this.roleRepository.remove(role);
      role.id = id;
      return role;
    } catch (err) {
      throw new Error('Something went wrong');
    }
  }
}
