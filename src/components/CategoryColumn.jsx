import React from 'react';
import AnswerCard from './AnswerCard';

export default ({category, mode, categoryIndex}) => {
    return (
        <div className="category-column">
            <h2>{category.name}</h2>
            {category.cards.map((card, cardIndex) => {
                return <AnswerCard card={card} category={category} cost={(cardIndex + 1) * 100} cardIndex={cardIndex} categoryIndex={categoryIndex} mode={mode} />
            })}
        </div>
    )
}