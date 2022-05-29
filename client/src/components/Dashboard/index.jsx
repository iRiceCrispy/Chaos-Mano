import React, { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import socket from '../../socket';
import { fetchUsers } from '../../store/users';
import { fetchParties } from '../../store/parties';
import { fetchDrops } from '../../store/drops';
import ProfileButton from '../ProfileButton';
import Main from './Main';
import Parties from './Parties';
import Drops from './Drops';
import Payments from './Payments';
import Users from '../Users';
import PartyDetails from '../PartyDetails';
import DropDetails from '../DropDetails';
import PartyForm from '../Forms/PartyForm';
import DropForm from '../Forms/DropForm';
import './Dashboard.scss';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await dispatch(fetchUsers());
      await dispatch(fetchParties());
      await dispatch(fetchDrops());

      setIsLoaded(true);
    })();
  }, [dispatch]);

  useEffect(() => {
    socket.on('userStatus', () => {
      dispatch(fetchUsers());
    });

    socket.on('updateParties', () => {
      dispatch(fetchParties());
      dispatch(fetchDrops());
    });

    socket.on('updateDrops', () => {
      dispatch(fetchDrops());
    });
  }, [dispatch]);

  return isLoaded && (
    <div id="dashboard">
      <nav className="sidebar">
        <div className="home">
          <Link className="logo" type="button" to="/">
            <img src="/favicon.ico" alt="favicon" />
            <span className="text">Chaos Mano</span>
          </Link>
        </div>
        <ul className="menu">
          <li>
            <NavLink
              className="menuItem"
              to="./"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              className="menuItem"
              to="parties"
            >
              Parties
            </NavLink>
          </li>
          <li>
            <NavLink
              className="menuItem"
              to="drops"
            >
              Drops
            </NavLink>
          </li>
          <li>
            <NavLink
              className="menuItem"
              to="payments"
            >
              Payments
            </NavLink>
          </li>
          <li>
            <NavLink
              className="menuItem"
              to="users"
            >
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="topbar">
        <div className="menu">
          <Link className="btn transparent menuItem" to="parties/create">Create new party</Link>
        </div>
        <div className="auth">
          <ProfileButton />
        </div>
      </div>
      <div className="contentContainer">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="parties" element={<Parties />} />
          <Route path="parties/:id" element={<PartyDetails />} />
          <Route path="parties/:id/edit" element={<PartyForm edit />} />
          <Route path="parties/:id/add-drop" element={<DropForm />} />
          <Route path="parties/create" element={<PartyForm />} />
          <Route path="drops" element={<Drops />} />
          <Route path="drops/:id" element={<DropDetails />} />
          <Route path="drops/:id/edit" element={<DropForm edit />} />
          <Route path="payments" element={<Payments />} />
          <Route path="users" element={<Users />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
