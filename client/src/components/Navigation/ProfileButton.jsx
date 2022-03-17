import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { logout } from '../../store/session';

const DropDownMenu = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);

  return (
    <div className='profileMenu' role='none' onClick={e => e.stopPropagation()}>
      <p>
        Username:
        {' '}
        {user.username}
      </p>
      <p>
        Email:
        {' '}
        {user.email}
      </p>
      <div className='logout' role='button' tabIndex='0 ' onClick={() => dispatch(logout())}>
        <FontAwesomeIcon icon='fas fa-arrow-right-from-bracket' />
        Log Out
      </div>
    </div>
  );
};

const ProfileButton = () => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  return (
    <div className='profileContainer'>
      <button className='btn transparent profile' type='button' onClick={() => !showMenu && setShowMenu(true)}>
        <FontAwesomeIcon icon='fas fa-user' />
      </button>
      {showMenu && <DropDownMenu />}
    </div>
  );
};

export default ProfileButton;
