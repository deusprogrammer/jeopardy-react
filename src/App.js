import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import './App.css';
import Dev from './devComponents/Dev';
import Jeopardy from './routes/Jeopardy';
import Create from './routes/Create';
import Home from './routes/Home';

const App = () => {
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path={`${process.env.PUBLIC_URL}/`} exact element={<Home />} />
                <Route path={`${process.env.PUBLIC_URL}/host`} exact element={<Jeopardy mode="host" />} />
                <Route path={`${process.env.PUBLIC_URL}/play/:id`} exact element={<Jeopardy mode="play" />} />
                <Route path={`${process.env.PUBLIC_URL}/create`} exact element={<Create />} />
                { process.env.NODE_ENV === 'development' ?
                    <Route exact path={`${process.env.PUBLIC_URL}/dev`} element={<Dev />} /> : null
                }
            </Routes>
        </BrowserRouter>
    );
}

export default App;