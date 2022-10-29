import React, {useEffect, useState, useRef} from 'react';
import { useAtom } from 'jotai';
import { useParams } from 'react-router';

import ShowCardAtom from '../atoms/ShowCard.atom';

import AnswerCard from '../components/AnswerCard';
import CategoryColumn from '../components/CategoryColumn';

import axios from 'axios';
import SessionAtom from '../atoms/Session.atom';

const Jeopardy = ({mode}) => {
    const {id} = useParams();

    const [session, setSession] = useAtom(SessionAtom);
    const [{card, category, categoryIndex: selectedCategoryIndex, cardIndex: selectedCardIndex, cost},] = useAtom(ShowCardAtom);
    const [players, setPlayers] = useState([]);

    const [state, setState] = useState("init");
    const [newPlayer, setNewPlayer] = useState("");
    
    const playerNameForm = useRef();

    const createSession = async () => {
        let sessionUrl = `https://deusprogrammer.com/api/jeopardy-svc/sessions`;
        let {data: created} = await axios.post(sessionUrl, {
            rounds: 1,
            players
        }, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });

        setSession(created);
        setState("playing");
    }

    const loadSession = async () => {
        let sessionUrl = `https://deusprogrammer.com/api/jeopardy-svc/sessions`;
        let {data: loaded} = await axios.get(`${sessionUrl}/${id}`, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });

        setSession(loaded);
        setState("playing");
    }

    const updateSession = async () => {
        let sessionUrl = `https://deusprogrammer.com/api/jeopardy-svc/sessions/${session.id}`;
        await axios.put(sessionUrl, session, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });
    }

    const nextRound = async () => {
        let updated = {...session};

        updated.round++;
        setSession(updated);
    }

    const addPlayer = () => {
        let playerMap = {...players};
        playerMap[newPlayer] = {
            name: newPlayer,
            score: 0
        }
        setPlayers(playerMap);
        setNewPlayer("");
        playerNameForm.current.focus();
    }

    const deletePlayer = (name) => {
        let playerMap = {...players};
        delete playerMap[name];
        setPlayers(playerMap);
    }

    useEffect(() => {
        if (state === "init" && mode === "play") {
            loadSession();
        } else if (state === "creating" && mode === "host") {
            createSession();
        }
    }, [state]);

    useEffect(() => {
        console.log(session);
        if (session) {
            updateSession();   
        }
    }, [session]);

    if (state === "init" && mode === "host") {
        setState("addPlayers");
    }

    if (state === "init") {
        return <div style={{display: "flex", alignContent: "center", justifyContent: "center"}}>Loading board...</div>
    } else if (state === "addPlayers") {
        return (
            <div id="game-form">
                <h2>Add Players</h2>
                {Object.keys(players).map((name, index) => {
                    let player = players[name];
                    return (
                        <div key={`player-${index}`}>{player.name}<button onClick={() => {deletePlayer(name)}}>Delete</button></div>
                    )
                })}
                <input type="text" onChange={({target: {value}}) => {setNewPlayer(value)}} value={newPlayer} ref={playerNameForm} /><button onClick={() => {addPlayer()}}>Add</button>
                <br />
                <button onClick={() => {setState("creating")}}>Done</button>
            </div>
        )
    } else if (state === "playing") {
        return ( 
            <div id="game-container">
                <div id="jeopardy">
                    <AnswerCard 
                        card={card} 
                        category={category} 
                        cost={cost} 
                        categoryIndex={selectedCategoryIndex}
                        cardIndex={selectedCardIndex}
                        fullscreen={true} />
                    { session.rounds[session.currentRound].categories.map((category, categoryIndex) => {
                        return <CategoryColumn category={category} mode={mode} categoryIndex={categoryIndex} />
                    })}
                </div>
                {mode === "host" ?
                    <div id="data-display">
                        {session.currentRound < session.rounds.length - 1 ? <button onClick={nextRound}>Next Round</button> : null}
                        <div id="player-display">
                            {Object.keys(session.players).map(key => {
                                let player = session.players[key];
                                return (
                                    <div>{player.name}: ${player.score}</div>
                                )
                            })}
                        </div>
                    </div>
                : null}
            </div>
        );
    } else {
        return (
            <div>
                Invalid state
            </div>
        )
    }
}

export default Jeopardy;