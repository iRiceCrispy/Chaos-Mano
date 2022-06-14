import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notificationsSelectors } from '../../store/notifications';
import Notification from './Notification';
import './Notifications.scss';

const Notifications = () => {
  const ref = useRef();
  const notifications = useSelector(notificationsSelectors.selectAll);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const closeMenu = (e) => {
      if (!ref.current?.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  return (
    <div id="notificationsContainer" ref={ref}>
      <button
        className="btn transparent notificationButton"
        type="button"
        onClick={() => setShowMenu(prev => !prev)}
      >
        <FontAwesomeIcon icon="fa-solid fa-bell" />
      </button>
      {showMenu && (
        <ul
          className="notficationsMenu"
          role="menu"
          tabIndex={-1}
          onClick={e => e.stopPropagation()}
        >
          {notifications.map(notification => (
            <li className="notification" key={notification.id}>
              <Notification notification={notification} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
