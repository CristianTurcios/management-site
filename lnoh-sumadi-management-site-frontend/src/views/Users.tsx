import React, { FC } from 'react';
import UsersTable from '../components/UsersTable/UsersTable';
import RolesTable from '../components/RolesTable/RolesTable';

const UsersView: FC = () => (
  <section className="container--main container--main__no-sidebar">
    <div className="container">
      <div className="row">
        <div className="col-12 section--boxed">
          <div className="nav-tabs nav-landing-tabs">
            <input className="state" type="radio" title="tab-one" name="tabs-state" id="tab-one" defaultChecked />
            <input className="state" type="radio" title="tab-two" name="tabs-state" id="tab-two" />
            <div className="tabs flexible-tabs">
              <label className="tab" htmlFor="tab-one" id="tab-one-label">Users</label>
              <label className="tab" htmlFor="tab-two" id="tab-two-label">Roles</label>
              <UsersTable />
              <RolesTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default UsersView;
