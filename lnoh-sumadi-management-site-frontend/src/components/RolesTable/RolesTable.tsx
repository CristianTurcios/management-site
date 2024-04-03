import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import useModal from 'helpers/useModal';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader/Loader';
import FeedBack from 'components/FeedBack/FeedBack';
import CreateRole from 'components/FormRole/FormRole';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { getRoles as getRolesType } from 'apollo/queries/types/getRoles';
import GET_ROLES, { DELETE_ROLE, GET_ROLE_BY_ID } from 'apollo/queries/roles';
import {
  getRoleById as getRoleByIdType,
  getRoleByIdVariables, getRoleById_Role as Role,
} from 'apollo/queries/types/getRoleById';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { hasAccess } from 'services/AuthenticationService';
import { SessionContext } from 'context/SessionContext';

const RolesTable: FC = () => {
  const [title, setTitle] = useState('');
  const [role, setRole] = useState<any>();
  const { isShowing, toggle } = useModal();
  const [error, setError] = useState(false);
  const [roles, setRoles] = useState<any>([]);
  const [success, setSuccess] = useState(false);
  const { loading, data } = useQuery<getRolesType>(GET_ROLES);
  const { session } = useContext(SessionContext);

  const [getRoleById, { loading: roleByIdLoading }] = useLazyQuery<
    getRoleByIdType, getRoleByIdVariables>(GET_ROLE_BY_ID, {
      fetchPolicy: 'network-only',
      onCompleted(roleByIdData) {
        setRole(roleByIdData.Role);
        if (!isShowing) toggle();
      },
    });

  const [deleteRoleCallBack, { loading: deleteRoleLoading, error: deleteRoleError }] = useMutation(
    DELETE_ROLE,
    {
      update(cache, { data: { deleteRole } }) {
        const cacheData = cache.readQuery({ query: GET_ROLES }) as getRolesType;
        let newData = [...cacheData.Roles];
        newData = newData.filter((element) => element?.id !== deleteRole.id);
        cache.writeQuery({ query: GET_ROLES, data: { Roles: newData } });
      },
    },
  );

  const deleteRoleHandler = async (id: string) => {
    try {
      await deleteRoleCallBack({ variables: { id } });
      setSuccess(true);
      setTitle('Role Successfully Deleted.');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  const updateRoleHandler = async (id: string) => {
    getRoleById({ variables: { id } });
  };

  const createRoleHandler = (isOnCreateMode: boolean) => {
    setSuccess(true);
    const message = isOnCreateMode ? 'Role Successfully Created.' : 'Role Successfully Updated.';
    setTitle(message);
    setTimeout(() => setSuccess(false), 3000);
  };

  useEffect(() => {
    if (!loading && data && data.Roles) {
      console.log(data.Roles);
      setRoles(data.Roles);
    }
  }, [data, loading]);

  const actionBodyTemplate = (row: Role) => (
    <div className="table--colum">
      <ul>
        <li>
          <a
            href={undefined}
            onClick={(e) => {
              e.preventDefault();
              updateRoleHandler(row.id);
            }}
          >
            <div className="button--circle">
              <i><FontAwesomeIcon icon={faPen} /></i>
            </div>
          </a>
        </li>
        <li>
          <a
            onClick={() => deleteRoleHandler(row.id)}
            href={undefined}
          >
            <div className="button--circle">
              <i><FontAwesomeIcon icon={faTrash} /></i>
            </div>
          </a>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="panel--box" id="tab-two-panel">
      <div className="col-12">
        <div className="row panel--box-header">
          <div className="col-6">
            <div className="title title--medium">Roles Management</div>
          </div>
          { hasAccess(session.user.role as string, ['Admin', 'Editor']) && (
          <div className="col-6">
            <button
              type="button"
              className="button--normal float-right"
              onClick={() => { setRole(undefined); setSuccess(false); setError(false); toggle(); }}
            >
              Add New Role
            </button>
          </div>
          )}
          <Modal isShowing={isShowing}>
            <CreateRole hide={toggle} role={role} onCreated={createRoleHandler} />
          </Modal>
        </div>
      </div>
      <div className="col-12">
        <span />
        {
          (deleteRoleError && error) && (
            <FeedBack
              text={deleteRoleError.message}
              isSuccess={false}
              onClose={() => setError(false)}
            />
          )
        }
        {
          success && (
            <FeedBack
              text={title}
              isSuccess
              onClose={() => setSuccess(false)}
            />
          )
        }
      </div>

      <div className="col-12 table">
        <div className="row custom-table">
          {(loading || deleteRoleLoading || roleByIdLoading) && <Loader />}
          <DataTable
            value={roles}
            emptyMessage="No roles found"

          >
            <Column field="role" header="Role" />
            { hasAccess(session.user.role as string, ['Admin', 'Editor'])
            && <Column header="Actions" body={actionBodyTemplate} />}

          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default RolesTable;
