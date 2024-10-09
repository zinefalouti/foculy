import React, { useState } from 'react';
import Search from './search';
import Feed from './feed';
import HomeStats from './homeStats';
import ThemeToggle from './themeToggle';

function Home({ isDark, ToggleFunction }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term); // Update the search term
  };

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8">
        <Search onSearch={handleSearch} /> {/* Pass handleSearch to Search */}
        <Feed isDark={isDark} searchTerm={searchTerm} /> {/* Pass searchTerm to Feed */}
      </div>
      <div className="col-span-12 lg:col-span-4">
        <HomeStats isDark={isDark} />
        <ThemeToggle isDark={isDark} ToggleFunction={ToggleFunction} />
      </div>
    </div>
  );
}

export default Home;
