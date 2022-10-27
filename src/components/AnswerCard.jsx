import { useAtom } from 'jotai';
import React, {useState} from 'react';
import ShowCardAtom, { EMPTY_CARD_DATA } from '../atoms/ShowCard.atom';

export default ({card, category, cost, fullscreen}) => {
    const [, setShowCard] = useAtom(ShowCardAtom);

    if (!card && fullscreen) {
        return (
            <div className="answer-card fullscreen hidden">
            </div>
        )
    }

    const {answer, question, mediaUrl, type} = card;
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");

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
            {mode === "host" ? null : mediaContent}
            <div>{mode === "host" ? question : answer}</div>
        </>
    );

    if (fullscreen) {
        return (
            <div className="answer-card fullscreen" onClick={() => {setShowCard(EMPTY_CARD_DATA)}}>
                {content}
            </div>
        )
    } else {
        return (
            <div className="answer-card" onClick={() => {setShowCard({card, cost, category})}}>
                ${cost}
            </div>
        )
    }
}