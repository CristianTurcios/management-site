import React, {
  Dispatch, FC, SetStateAction, ChangeEvent,
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faPollH, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { AccountFilters, AvailableFilters } from 'interfaces/Account';
import { getAccountsByRegion } from 'apollo/queries/types/getAccountsByRegion';

type SidebarProps = {
    hidden: boolean;
    setHide: Dispatch<SetStateAction<boolean>>;
    setFilters: Dispatch<SetStateAction<AccountFilters>>;
    filters: AccountFilters;
    page: number;
    regionsData?: getAccountsByRegion
}
const Sidebar: FC<SidebarProps> = (props) => {
  const {
    hidden, setHide, setFilters, filters, regionsData,
  } = props;
  const handleFilters = (e: ChangeEvent<HTMLInputElement>) => {
    const temp = { ...filters };
    const filterValue = e.target.value;
    const filterName = ({ value: e.target.name } as AvailableFilters).value;

    if (e.target.checked) {
      temp[filterName] = [...temp[filterName], filterValue];
    } else {
      const copy = [...temp[filterName]];
      copy.splice(copy.indexOf(filterValue), 1);
      temp[filterName] = [...copy];
    }
    setFilters(temp);
  };

  return (
    <div className={`sidebar-container ${hidden || 'show'}`}>
      <div className="sidebar__overlay" />

      <div className="sidebar--filters">
        <div className="sidebar__title">
          <div className="sidebar__title-text">
            <h3>Filters</h3>
          </div>
          <button
            type="button"
            className="button--transparent button--close-sidebar"
            onClick={() => setHide(true)}
          >
            <FontAwesomeIcon icon={faTimesCircle} />
          </button>
        </div>
        <div className="sidebar__filter-container">
          <div className="sidebar__filter-section">

            <div className="sidebar__filter-section-title">
              <h4>By Region</h4>
            </div>
            <div className="sidebar__filter-checkbox-container">
              {regionsData?.accountsByRegion?.map((region) => region?.region && (
                <div key={region?.region} className="switch switch--square">
                  <input
                    type="checkbox"
                    name="byRegion"
                    value={region.region}
                    onChange={handleFilters}
                    checked={filters.byRegion.includes(region.region)}
                  />
                  <span className="slider">
                    <div className="switch__text switch__text--on">
                      <FontAwesomeIcon icon={faGlobe} className="switch__icon" />
                      <span>{region?.region}</span>
                    </div>
                    <div className="switch__text switch__text--off">
                      <FontAwesomeIcon icon={faGlobe} className="switch__icon" />
                      <span>{region?.region}</span>
                    </div>
                  </span>
                </div>
              ))}
            </div>
            <div className="sidebar__filter-section-title">
              <h4>By Status</h4>
            </div>
            <div className="sidebar__filter-checkbox-container">
              <div className="switch switch--square">
                <input
                  type="checkbox"
                  name="byStatus"
                  value="active"
                  checked={filters.byStatus.includes('active')}
                  onChange={handleFilters}
                />
                <span className="slider">
                  <div className="switch__text switch__text--on">
                    <FontAwesomeIcon icon={faPollH} className="switch__icon" />
                    <span>Active</span>
                  </div>
                  <div className="switch__text switch__text--off">
                    <FontAwesomeIcon icon={faPollH} className="switch__icon" />
                    <span>Active</span>
                  </div>
                </span>
              </div>
              <div className="switch switch--square">
                <input
                  type="checkbox"
                  name="byStatus"
                  value="inactive"
                  checked={filters.byStatus.includes('inactive')}
                  onChange={handleFilters}
                />
                <span className="slider">
                  <div className="switch__text switch__text--on">
                    <FontAwesomeIcon icon={faPollH} className="switch__icon" />
                    <span>Inactive</span>
                  </div>
                  <div className="switch__text switch__text--off">
                    <FontAwesomeIcon icon={faPollH} className="switch__icon" />
                    <span>Inactive</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
