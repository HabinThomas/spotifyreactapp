import styles from './Tracklist.module.css';
import Track from '../Track/Track';

function Tracklist({ list, ...rest }) {
    return (
        <div className={styles.tracklist}>
            {list.length > 0 && list.map(track => {
                return <Track key={track.id} track={track} {...rest} />;
            })}
        </div>
    );
}
export default Tracklist;