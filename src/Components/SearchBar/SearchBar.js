import React, { useState } from 'react';
import styles from "./SearchBar.module.css";

const SearchBar = (props) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleChange = ({ target }) => {
        setSearchTerm(target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            sessionStorage.setItem("searchTerm", searchTerm);
            props.handleSearch(searchTerm);
            setSearchTerm('');
        }
    };

    return (
        <form className={styles.searchbar} onSubmit={handleSubmit}>
            <input
                type='text'
                placeholder="Enter A Song, Album, or Artist"
                value={searchTerm}
                onChange={handleChange}
            />
            <button className="SearchButton">SEARCH</button>
        </form>
    );

}
export default SearchBar;
