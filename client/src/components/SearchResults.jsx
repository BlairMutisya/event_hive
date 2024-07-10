import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = new URLSearchParams(location.search);
      const searchOption = query.keys().next().value;
      const searchTerm = query.get(searchOption);

      if (!searchOption || !searchTerm) {
        setError("Invalid search query");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/events?${searchOption}=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          setError("Failed to fetch search results");
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("An error occurred while fetching search results");
      }
    };

    fetchSearchResults();
  }, [location.search]);

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {results.length > 0 ? (
          results.map((event) => (
            <li key={event.id}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.date_time).toLocaleString()}</p>
              <p><strong>Location:</strong> {event.location}</p>
            </li>
          ))
        ) : (
          <p>No results found</p>
        )}
      </ul>
    </div>
  );
};

export default SearchResults;