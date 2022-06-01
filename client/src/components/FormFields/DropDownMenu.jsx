import React from 'react';
import './DropDownMenu.css';

const DropDownMenu = ({ matches, setter, setShowMenu }) => (
  <div className="dropdownMenu">
    {matches?.length
      ? matches.map(match => (
        <div
          className="dropdownOption"
          key={match.id}
          role="menuitem"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            setter(match);
            setShowMenu(false);
          }}
        >
          {match.value}
        </div>
      ))
      : <div className="noResults">No results found.</div>}
  </div>
);

export default DropDownMenu;
