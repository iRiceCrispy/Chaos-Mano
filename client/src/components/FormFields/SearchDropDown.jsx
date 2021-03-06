import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DropDownMenu from './DropDownMenu';
import './SearchDropDown.css';

const SearchDropDown = ({ id, placeholder, options, result, setResult, zIndex }) => {
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const matches = options
    ?.filter(option => option.value.toLowerCase().includes(input.toLowerCase()));

  // if (disabled) {
  //   if (input) setInput('');
  //   if (result) setResult('');
  // }

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const setValue = (match) => {
    setInput('');
    setResult(match.id);
  };

  // useEffect(() => {
  //   const height = document.querySelector('.search.dropdown').offsetHeight;
  //   document.querySelector('.dropdownContainer').style.height = height;
  // }, []);

  return (
    <div
      className={`searchDropdownContainer${showMenu ? ' showMenu' : ''}`}
      role="menuitem"
      tabIndex={0}
      onClick={(e) => {
        e.stopPropagation();
        setShowMenu(true);
      }}
    >
      <div className="searchDropdown" style={{ zIndex }}>
        <div className="result">
          <input
            id={id}
            className="search"
            type="text"
            value={input || result || ''}
            placeholder={placeholder}
            onChange={(e) => {
              setInput(e.target.value);
              setResult('');
            }}
          />
        </div>
        {showMenu && (
          <DropDownMenu matches={matches} setter={setValue} setShowMenu={setShowMenu} />
        )}
      </div>
    </div>
  );
};

SearchDropDown.propTypes = {
  id: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  result: PropTypes.string,
  setResult: PropTypes.func.isRequired,
  zIndex: PropTypes.number,
};

SearchDropDown.defaultProps = {
  id: '',
  placeholder: '',
  zIndex: 0,
  options: undefined,
  result: undefined,
};

export default SearchDropDown;
