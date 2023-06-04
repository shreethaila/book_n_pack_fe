import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://api.example.com/search?q=${searchQuery}`);
      const data = response.data;
      setSearchResults(data.results);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={searchQuery} onChange={handleInputChange} placeholder="Search..." />
      <button onClick={handleSearch}>Search</button>
      
      {searchResults.length > 0 && (
        <div>
          <p>Showing results for: {searchQuery}</p>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id}>{result.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
