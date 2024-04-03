import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  getUsers as getUsersType,
  getUsersVariables,
} from 'apollo/queries/types/getUsers';
import { client } from 'apollo/client';
import useModal from 'helpers/useModal';
import Modal from 'components/Modal/Modal';
import Loader from 'components/Loader/Loader';
import CreateUser from 'components/FormUser/FormUser';
import GET_USERS, { DELETE_USER, GET_USER_BY_ID } from 'apollo/queries/users';
import { deleteUser as deleteUserType, deleteUserVariables } from 'apollo/queries/types/deleteUser';
import { Notification, NotificationType } from 'interfaces/Notification';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getUserById_User as User } from 'apollo/queries/types/getUserById';
import userAvatar from 'assets/img/bg-modal-keyboard.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import FeedBack from 'components/FeedBack/FeedBack';
import { hasAccess } from 'services/AuthenticationService';
import { SessionContext } from 'context/SessionContext';

interface Page {
  first: number;
  rows: number;
  page: number;
}

const UsersTable: FC = () => {
  const [limit, setLimit] = useState(5);
  const [currentPage, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState<any>([]);
  const [user, setUser] = useState<any>();
  const [fetchUsers, setFetchUsers] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [firstRow, setFirstRow] = useState(0);
  const { isShowing, toggle } = useModal();
  const { session } = useContext(SessionContext);
  const [notification, setNotification] = useState<Notification>({
    show: false,
    message: '',
    type: NotificationType.Empty,
  });

  const [deleteUser, { loading: deleteLoading }] = useMutation<deleteUserType, deleteUserVariables>(
    DELETE_USER, {
      onCompleted() {
        client.resetStore();
      },
    },
  );

  const { loading, data, refetch } = useQuery<getUsersType, getUsersVariables>(
    GET_USERS,
    {
      variables: {
        page: currentPage, limit,
      },
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    try {
      if (!isShowing && fetchUsers) {
        refetch();
        setNotification({ show: false, message: '', type: NotificationType.Empty });
        setFetchUsers(false);
      }
    } catch (error) {
      setNotification({ show: true, message: error.message, type: NotificationType.Error });
    }
  }, [toggle]);

  const deleteUserHandler = async (id: string) => {
    try {
      await deleteUser({ variables: { id } });
      setNotification({ show: true, message: 'Success: User Successfully Deleted', type: NotificationType.Success });
      refetch();
    } catch (err) {
      setNotification({ show: true, message: err.message, type: NotificationType.Error });
    }
  };

  const updateUserHandler = async (id: string) => {
    try {
      setUserLoading(true);
      setNotification({ show: false, message: '', type: NotificationType.Empty });
      const { data: userData } = await client.query({
        query: GET_USER_BY_ID,
        variables: { id },
      });
      setUser(userData.User);
      setUserLoading(false);
      if (!isShowing) toggle();
    } catch (error) {
      setUserLoading(false);
      setNotification({ show: true, message: error.message, type: NotificationType.Error });
    }
  };

  useEffect(() => {
    if (!loading && data && data.Users && data.Users.items) {
      setTotalUsers(data.Users.meta.totalItems);
      setUsers(data.Users.items);
    }
  }, [data, loading]);

  const onPage = (e: Page) => {
    setLimit(e.rows);
    setFirstRow(e.first);
    setPage(e.page + 1);
  };

  const nameBodyTemplate = (row: User) => (
    <div className="avatar avatar--table">
      <img className="avatar--small" src={row.imageUrl || userAvatar} alt="user" />
      <div className="avatar--name">
        <span>{`${row.firstName} ${row.lastName}`}</span>
      </div>
    </div>
  );
  const statusBodyTemplate = (row: User) => <span>{row.status ? 'Active' : 'Inactive'}</span>;
  const verifiedBodyTemplate = (row: User) => <span>{row.isVerified.toString()}</span>;
  const roleBodyTemplate = (row: User) => <span>{row.role.role}</span>;
  const actionBodyTemplate = (row: User) => (
    <div className="table--colum">
      <ul>
        <li>
          <a
            href={undefined}
            onClick={(e) => {
              e.preventDefault();
              updateUserHandler(row.id);
            }}
          >
            <div className="button--circle">
              <i><FontAwesomeIcon icon={faPen} /></i>
            </div>
          </a>
        </li>
        <li>
          <a
            onClick={() => deleteUserHandler(row.id)}
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
    <div className="panel--box" id="tab-one-panel">
      <div className="col-12">
        <div className="row panel--box-header">
          <div className="col-12 col-md-6">
            <div className="title title--medium">User Management</div>
          </div>
          <div className="col-12 col-md-6">

            { hasAccess(session.user.role as string, ['Admin', 'Editor'])
            && (
            <button
              type="button"
              className="button--normal float-right"
              onClick={() => {
                setUser(null);
                setNotification({ show: false, message: '', type: NotificationType.Empty });
                toggle();
              }}
            >
              Add New User
            </button>
            )}
          </div>

          <Modal isShowing={isShowing}>
            <CreateUser hide={toggle} user={user} refetch={setFetchUsers} />
          </Modal>
        </div>
      </div>
      <div className="col-12">
        <span />
        {
          notification.show && (
            <FeedBack
              text={notification.message}
              isSuccess={notification.type === NotificationType.Success}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          )
        }
      </div>
      <div className="col-12 table">
        <div className="row custom-table">
          { (loading || deleteLoading || userLoading) && <Loader /> }
          <DataTable
            value={users}
            paginator
            paginatorTemplate="CurrentPageReport
            FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
            rows={5}
            lazy
            emptyMessage="No users found"
            totalRecords={totalUsers}
            onPage={onPage}
            first={firstRow}
            className="p-datatable-striped"
          >
            <Column header="Name" body={nameBodyTemplate} />
            <Column field="email" style={{ width: '20em' }} header="Email" />
            <Column header="Verified" body={verifiedBodyTemplate} />
            <Column header="Status" body={statusBodyTemplate} />
            <Column header="Role" body={roleBodyTemplate} />
            { hasAccess(session.user.role as string, ['Admin', 'Editor'])
            && <Column header="Actions" body={actionBodyTemplate} />}

          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
