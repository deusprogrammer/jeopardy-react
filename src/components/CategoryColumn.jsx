import React from 'react';
import AnswerCard from './AnswerCard';

export default ({category}) => {
    return (
        <div className="category-column">
            <h2>{category.name}</h2>
            {category.cards.map((card, index) => {
                return <AnswerCard card={card} category={category} cost={(index + 1)* 100} />
            })}
        </div>
    )
}