import { useAtom } from 'jotai';
import cloneDeep from 'lodash/cloneDeep';
import React, {useState} from 'react';
import HiddenCardsAtom from '../atoms/HiddenCards.atom';
import SessionAtom from '../atoms/Session.atom';
import ShowCardAtom, { EMPTY_CARD_DATA } from '../atoms/ShowCard.atom';

export default ({card, category, cost, fullscreen, cardIndex, categoryIndex}) => {
    const [showAnswer, setShowAnswer] = useState(false);
    const [, setShowCard] = useAtom(ShowCardAtom);
    const [session, setSession] = useAtom(SessionAtom);

    const awardPoints = (playerName, cost) => {
        let sessionCopy = cloneDeep(session);
        sessionCopy.players[playerName].score += cost;
        sessionCopy.rounds[sessionCopy.currentRound].categories[categoryIndex].cards[cardIndex].complete = true;
        console.table(sessionCopy);
        setSession(sessionCopy);
        setShowCard(EMPTY_CARD_DATA);
        setShowAnswer(false);
    }

    if (!card && fullscreen) {
        return (
            <div className="answer-card fullscreen hidden">
            </div>
        )
    }

    const {answer, question, mediaUrl, type} = card;

    let content;
    let mediaContent;
    switch (type) {
        case "image":
            mediaContent = <img src={mediaUrl} />
            break;
        case "audio":
            mediaContent = <audio src={mediaUrl} autoPlay={true} controls={false} />
            break;
        case "video":
            mediaContent = <video src={mediaUrl} autoPlay={true} controls={false} />
            break;
        case "none":
        default:
            mediaContent = null;
    }

    content = (
        <>
            <div>{category.name} - ${cost}</div>
            {mediaContent}
            <div>{showAnswer ? `Q: ${question}` : `A: ${answer}`}</div>
            {showAnswer ? 
                <div className="scoring-div">
                    {Object.keys(session.players).map((key) => {
                        let {name, score} = session.players[key];
                        return <button onClick={() => {awardPoints(name, cost * (session.currentRound + 1))}}>Award Win to {name} [${score}]</button>
                    })}
                </div> : null
            }
        </>
    );

    if (card.complete) {
        return (
            <div className="answer-card complete">
                ${cost * (session.currentRound + 1)}
            </div>
        )
    }

    if (fullscreen) {
        return (
            <div className="answer-card fullscreen" onClick={
                () => {
                    if (!showAnswer) {
                        setShowAnswer(true);
                    }
                }}>
                {content}
            </div>
        )
    } else {
        return (
            <div className="answer-card" onClick={() => {setShowCard({card, cost, category, categoryIndex, cardIndex})}}>
                ${cost}
            </div>
        )
    }
}