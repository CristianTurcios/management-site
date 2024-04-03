import { useHistory } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import React, {
  FC, useContext, useEffect, useState,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PageState, Paginator } from 'primereact/paginator';
import Loader from 'components/Loader/Loader';
import FeedBack from 'components/FeedBack/FeedBack';
import AccountCard from 'components/AccountCard/AccountCard';
import Sidebar from 'components/Sidebar/Sidebar';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { GET_ACCOUNTS, GET_ACCOUNTS_BY_REGION, UPDATE_ACCOUNT } from 'apollo/queries/accounts';
import { getAccounts as getAccountsType, getAccountsVariables } from 'apollo/queries/types/getAccounts';
import { updateAccount as updateAccountType, updateAccountVariables } from 'apollo/queries/types/updateAccount';
import AccountMessage from 'components/AccountSteps/AccountMessage';
import { SessionContext } from 'context/SessionContext';
import { hasAccess } from 'services/AuthenticationService';
import { AccountFilters } from 'interfaces/Account';
import { getAccountsByRegion } from 'apollo/queries/types/getAccountsByRegion';

const Accounts: FC = () => {
  const [limit, setLimit] = useState(8);
  const [firstRow, setFirstRow] = useState(0);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hideSidebar, setHideSidebar] = useState(true);
  const [currentPage, setPage] = useState(1);
  const [accounts, setAccounts] = useState<any>([]);
  const [totalAccounts, setTotalAccounts] = useState(0);
  const [filters, setFilters] = useState<AccountFilters>({ byRegion: [], byStatus: [] });
  const history = useHistory();
  const { session } = useContext(SessionContext);

  const { loading, data, error: getAccountError } = useQuery<getAccountsType, getAccountsVariables>(
    GET_ACCOUNTS,
    {
      variables: {
        page: currentPage,
        limit,
        byRegion: filters.byRegion,
        byStatus: filters.byStatus,
      },
      fetchPolicy: 'network-only',
    },
  );

  const [updateAccount, { loading: updateLoading, error: updateError }] = useMutation<
    updateAccountType, updateAccountVariables>(UPDATE_ACCOUNT);

  const { loading: regionsLoading, data: regions } = useQuery<getAccountsByRegion>(GET_ACCOUNTS_BY_REGION,
    { fetchPolicy: 'network-only' });

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

  const onPageChange = (e: PageState) => {
    setLimit(e.rows);
    setFirstRow(e.first);
    setPage(e.page + 1);
  };

  useEffect(() => {
    if (!loading && data && data.Accounts && data.Accounts.docs) {
      setTotalAccounts(data.Accounts.total);
      setAccounts(data.Accounts.docs);
    }
  }, [data, loading]);

  if (loading || updateLoading || regionsLoading) {
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
      <Sidebar
        hidden={hideSidebar}
        setHide={setHideSidebar}
        setFilters={setFilters}
        page={currentPage}
        filters={filters}
        regionsData={regions}
      />
      <div className="container custom-table">
        <div className="col-12 section--boxed">
          <div className="row">
            <div className="col-12 title-container title-container--with-components">
              <div className="title title">Account Management</div>
              { hasAccess(session.user.role as string, ['Admin', 'Editor'])
              && (
              <button
                type="button"
                className="button--normal"
                onClick={() => history.push('account/add')}
              >
                Add new Account
              </button>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-sm-10">
              <div className="filter-title-container">
                <span className="title">Filtering by</span>
                <div className="filter-text-container">
                  <span className="filter-text">Region:</span>
                  {filters.byRegion.length && filters.byRegion.length !== regions?.accountsByRegion?.length
                    ? filters.byRegion.map((filter, index) => (
                      <span key={filter} className="filter-value">
                        &nbsp;
                        {filter}
                        &nbsp;
                        {filters.byRegion[index + 1] ? '-' : ''}
                      </span>
                    ))
                    : <span className="filter-value">ALL</span>}

                </div>
                <div className="filter-text-container">
                  <span className="filter-text">Status:</span>
                  {filters.byStatus.length && filters.byStatus.length !== 2
                    ? filters.byStatus.map((filter) => (
                      <span key={filter} className="filter-value">
                        {filter}
                        &nbsp;
                      </span>
                    ))
                    : <span className="filter-value">ALL</span>}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-2">
              <button className="button--circle button--filter" type="button" onClick={() => setHideSidebar(false)}>
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </div>
          </div>

          {
            (updateError && error) && (
              <div className="row">
                <div className="col-12">
                  <FeedBack
                    text={updateError.message}
                    isSuccess={false}
                    onClose={() => setError(false)}
                  />
                </div>
              </div>
            )
          }
          {
            (success) && (
              <div className="row">
                <div className="col-12">
                  <FeedBack
                    text="Account successfully updated"
                    isSuccess
                    onClose={() => setSuccess(false)}
                  />
                </div>
              </div>
            )
          }
          <div className="row">
            {
              accounts.map((element: any) => (
                <div className="col-12 col-md-6 col-lg-4 col-xl-3 card__container" key={element.id}>
                  <AccountCard
                    name={element.institution.name}
                    id={element.id}
                    isEnabled={element.isEnabled}
                    enabledAccount={async (id, isEnabled) => onChangeAccountStatus(id, isEnabled)}
                  />
                </div>
              ))
            }
          </div>

          <Paginator
            first={firstRow}
            rows={8}
            totalRecords={totalAccounts}
            onPageChange={onPageChange}
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
            template="CurrentPageReport
            FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          />
        </div>
      </div>
    </section>
  );
};

export default Accounts;
