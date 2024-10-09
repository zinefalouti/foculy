import React, { useState } from 'react';

function Search({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    onSearch(query); // Call the onSearch prop with the current query
    setQuery(''); // Clear the input field
  };

  return (
    <div className="SearchBar">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Search by Tag"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)} // Update state on input change
        />
        <input type="submit" value="Search" />
      </form>
    </div>
  );
}

export default Search;

