import styles from "./SearchResult.module.css"
import Tracklist from "../Tracklist/Tracklist";

function SearchResult({list, ...rest}) {
    const note = (
        <div className='note'>
            <p>
                Use search to find some tracks
            </p>
        </div>
    )

    return (
        <section>
            <h2>Search Results</h2>
            {!list[0] ? note : <Tracklist list={list} {...rest} /> }
        </section>
    );
}
export default SearchResult;