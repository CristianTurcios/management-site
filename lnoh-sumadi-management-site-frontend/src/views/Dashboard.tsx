import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ACCOUNTS_BY_REGION, GET_LATEST_ACCOUNTS, UPDATE_ACCOUNT } from 'apollo/queries/accounts';
import {
  getAccountsByRegion,
} from 'apollo/queries/types/getAccountsByRegion';
import {
  getLatestAccounts as getLatestAccountsType,
  getLatestAccountsVariables,
} from 'apollo/queries/types/getLatestAccounts';
import { GET_LATEST_USERS } from 'apollo/queries/users';
import {
  getLatestUsers as getLatestUsersType,
  getLatestUsersVariables,
  getLatestUsers_Users_items as latestUsersItems,
} from 'apollo/queries/types/getLatestUsers';
import { updateAccount as updateAccountType, updateAccountVariables } from 'apollo/queries/types/updateAccount';
import AddAccountButton from 'components/AddAccountButton/AddAccountButton';
import AccountMessage from 'components/AccountSteps/AccountMessage';
import AccountCard from 'components/AccountCard/AccountCard';
import RegionCard from 'components/RegionCard/RegionCard';
import Loader from 'components/Loader/Loader';
import FeedBack from 'components/FeedBack/FeedBack';
import LatestUser from 'components/LatestUser/LatestUser';
import { hasAccess } from 'services/AuthenticationService';
import { SessionContext } from 'context/SessionContext';

const DashboardView: FC = () => {
  const usersLimit = 6;
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [currentPage] = useState(1);
  const [users, setUsers] = useState<any>([]);
  const [accounts, setAccounts] = useState<any>([]);
  const { session } = useContext(SessionContext);

  const { loading: regionsLoading, data: regionsData } = useQuery<getAccountsByRegion>(GET_ACCOUNTS_BY_REGION,
    { fetchPolicy: 'network-only' });

  const { loading, data, error: getAccountError } = useQuery<getLatestAccountsType, getLatestAccountsVariables>(
    GET_LATEST_ACCOUNTS,
    {
      variables: {
        limit: 7,
      },
    },
  );

  const { loading: userLoading, data: userData } = useQuery<getLatestUsersType, getLatestUsersVariables>(
    GET_LATEST_USERS,
    {
      variables: {
        page: currentPage, limit: usersLimit, orderBy: 'DESC',
      },
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'network-only',
    },
  );

  const [updateAccount, { loading: updateLoading, error: updateError }] = useMutation<
  updateAccountType, updateAccountVariables>(UPDATE_ACCOUNT);

  const onChangeAccountStatus = async (id: string, isEnabled: boolean): Promise<any> => {
    const account = {
      isEnabled,
    };

    try {
      await updateAccount({ variables: { id, account } });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(true);
      setTimeout(() => setError(false), 5000);
    }
  };

  useEffect(() => {
    if (!userLoading && userData && userData.Users && userData.Users.items) {
      setUsers(userData.Users.items);
    }

    if (!loading && data && data.LatestAccounts && data.LatestAccounts.docs) {
      setAccounts(data.LatestAccounts.docs);
    }
  }, [data, loading, userData, userLoading]);

  if (loading || updateLoading || userLoading) {
    return <Loader />;
  }

  if (getAccountError) {
    const messageData = {
      title: 'Error',
      subtitle: getAccountError.message,
      isSuccess: false,
    };
    return (
      <section className="container--main container--main__no-sidebar">
        <div className="container">
          <div className="row">
            <div className="col-12 section--boxed">
              <AccountMessage message={messageData} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container--main container--main__no-sidebar">
      <div className="container">
        {regionsLoading && <Loader />}
        <div className="row">
          <div className="col-12 col-md-12 col-lg-12 col-xl--12 nav-bar">
            {
            (updateError && error) && (
              <FeedBack
                text={updateError.message}
                isSuccess={false}
                onClose={() => setError(false)}
              />
            )
            }
            {
            (success) && (
              <FeedBack
                text="Account successfully updated"
                isSuccess
                onClose={() => setSuccess(false)}
              />
            )
            }
          </div>
          { hasAccess(session.user.role as string, ['Admin', 'Editor'])
          && <AddAccountButton />}
          {
            accounts.map((element: any) => (
              <div className="col-12 col-md-6 col-lg-4 col-xl-3 card__container" key={element.id}>
                <AccountCard
                  name={element.institution.name}
                  id={element.id}
                  isEnabled={element.isEnabled}
                  enabledAccount={(id, isEnabled) => onChangeAccountStatus(id, isEnabled)}
                />
              </div>
            ))
          }
        </div>
        <div className="row">
          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="row full-height">
              {
            regionsData?.accountsByRegion?.map(
              (region) => (
                region?.region && region?.count && (
                  <div className="col-12 col-sm-6 spacer--s--vertical" key={region?.region}>
                    <RegionCard region={region.region} count={region.count} />
                  </div>
                )
              ),
            )
            }
            </div>
          </div>
          <div className="col-12 col-md-6 col-lg-8 col-xl-9 spacer--s--vertical">
            <div className="section--boxed">
              <div className="row">
                <div className="col-12">
                  <div className="subtitle subtitle--xtra-small">Activity</div>
                  <div className="title title--xtra-small">Latest Users</div>
                  <ul className="list list--2-columns">
                    {
                     users.map((element: latestUsersItems) => (
                       <li className="list__item" key={element.id}>
                         <LatestUser
                           imageUrl={element.imageUrl}
                           firstName={element.firstName}
                           lastName={element.lastName}
                           createdAt={element.createdAt}
                         />
                       </li>
                     ))
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardView;
