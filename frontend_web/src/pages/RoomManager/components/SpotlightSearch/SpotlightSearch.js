import React, { useState, useEffect, useRef } from 'react';
import './SpotlightSearch.css'; // 引入 SpotlightSearch 的样式

const users = [
  { name: 'Alice' },
  { name: 'Bob' },
  { name: 'Charlie' },
  // 添加更多用户数据...
];

const SpotlightSearch = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey) {
        setIsVisible(true);
        setTimeout(() => inputRef.current.focus(), 0);
      }
    };

    const handleKeyUp = (e) => {
      if (e.code==='Enter') {
        setIsVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <div>
      {isVisible && (
        <div className="spotlight-overlay">
          <div className="spotlight-searchBox">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="spotlight-input"
            />
            <ul className="spotlight-results">
              {filteredUsers.map((user, index) => (
                <li key={index}>{user.name}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpotlightSearch;
