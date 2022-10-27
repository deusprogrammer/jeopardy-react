import React from 'react';
import {Link} from 'react-router-dom';

export default () => {
    return (
        <div id="home-div">
            <h1>Jeopary</h1>
            <Link to={`${process.env.PUBLIC_URL}/play`}>Play</Link>
            <Link to={`${process.env.PUBLIC_URL}/create`}>Create</Link>
        </div>
    )
}