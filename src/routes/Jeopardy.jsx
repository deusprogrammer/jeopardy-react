import React, {useEffect, useState} from 'react';
import { useAtom } from 'jotai';

import ShowCardAtom from '../atoms/ShowCard.atom';

import AnswerCard from '../components/AnswerCard';
import CategoryColumn from '../components/CategoryColumn';

import {getCategories} from '../api/MockApi';

const Jeopardy = () => {
    const [categories, setCategories] = useState([]);
    const [{card, category, cost}, setShowCard] = useAtom(ShowCardAtom);

    const loadCategories = async () => {
        let loadedCategories = await getCategories();
        setCategories(loadedCategories);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return ( 
        <div id="jeopardy">
            <AnswerCard 
                card={card} 
                category={category} 
                cost={cost} 
                fullscreen={true} />
            { categories.map((category) => 
                <CategoryColumn category={category} />
            )}
        </div>
    );
}

export default Jeopardy;