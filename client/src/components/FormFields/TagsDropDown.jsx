import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DropDownMenu from './DropDownMenu';
import './TagsDropDown.css';

const TagsDropDown = ({ id, placeholder, options, results, setResult }) => {
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const matches = options
    ?.filter(option => option.value.toLowerCase().includes(input.toLowerCase())
    && !results?.some(result => result.value === option.value))
    .sort((a, b) => a.value.localeCompare(b.value));

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = () => {
      setShowMenu(false);
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const setter = (match) => {
    setInput('');
    setResult(prev => [...new Set([...prev, match])]
      .sort((a, b) => a.value.localeCompare(b.value)));
  };

  return (
    <>
      <div className="tagsContainer">
        {results?.map(result => (
          <div className="tag" key={result.id}>
            <span className="value">
              {result.value}
            </span>
            <span
              className="x"
              role="button"
              tabIndex={0}
              onClick={() => setResult(prev => prev.filter(item => item.value !== result.value))}
            >
              <FontAwesomeIcon icon="fas fa-xmark" />
            </span>
          </div>
        ))}
      </div>
      <div
        className="tagsDropdownContainer"
        role="menuitem"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(true);
        }}
      >
        <div className="tagsDropdown">
          <input
            id={id}
            className="search"
            type="text"
            value={input}
            placeholder={placeholder}
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          {showMenu && (
            <DropDownMenu
              matches={matches}
              setter={setter}
              setShowMenu={setShowMenu}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TagsDropDown;
