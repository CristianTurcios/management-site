import { gql } from '@apollo/client';

const GET_ROLES = gql`
query getRoles {
  Roles{
      id,
      role, 
  }
}`;

export const GET_ROLE_BY_ID = gql`
query getRoleById($id: String!) {
  Role(id: $id) {
    id
    role,
  }
}`;

export const POST_ROLE = gql`
mutation postRole($role: String!){
  postRole(role: $role) {
    id,
    role
  }
}`;

export const UPDATE_ROLE = gql`
mutation updateRole($id: String!, $role: String!) {
  updateRole(id: $id, role: $role) {
    id,
    role
  }
}`;

export const DELETE_ROLE = gql`
mutation deleteRole($id: String!){
  deleteRole(id: $id) {
    id
    role
  }
}`;

export default GET_ROLES;
