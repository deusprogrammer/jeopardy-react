import React, {useEffect, useState} from 'react';
import { useAtom } from 'jotai';

import ShowCardAtom from '../atoms/ShowCard.atom';

import AnswerCard from '../components/AnswerCard';
import CategoryColumn from '../components/CategoryColumn';

import axios from 'axios';

const Jeopardy = () => {
    const [categories, setCategories] = useState([]);
    const [{card, category, cost}, setShowCard] = useAtom(ShowCardAtom);

    const loadCategories = async () => {
        let catUrl = `https://deusprogrammer.com/api/jeopardy-svc/categories`;
        let cardUrl = `https://deusprogrammer.com/api/jeopardy-svc/cards`;
    
        let {data: categories} = await axios.get(catUrl, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });

        let selectedCategories = [];
        if (categories.length === 6) {
            selectedCategories = categories;
        }

        let categoryMaps = [];
        for (let category of selectedCategories.map(selectedCategory => selectedCategory.categoryString)) {
            let categoryMap = {name: category, cards: []};
            for (let difficulty = 1; difficulty <= 5; difficulty++) {
                let {data: cards} = await axios.get(`${cardUrl}?category=${category}&difficulty=${difficulty}`, {
                    headers: {
                        "X-Access-Token": localStorage.getItem("accessToken")
                    }
                });
                if (cards.length < 0) {
                    throw new Error("No difficulty found");
                }
                categoryMap.cards.push(cards[0]);
            }
            categoryMaps.push(categoryMap);
        }

        setCategories(categoryMaps);
    }

    useEffect(() => {
        loadCategories();
    }, []);

    if (!categories) {
        return <div style={{display: "flex", alignContent: "center", justifyContent: "center"}}>Loading board...</div>
    }

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