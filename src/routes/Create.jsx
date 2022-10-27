import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import axios from 'axios';

const EMPTY_CARD = {
    category: "Misc"
}

export default () => {
    const [categories, setCategories] = useState([]);
    const [card, setCard] = useState(EMPTY_CARD);
    const [categoryString, setCategoryString] = useState("");
    const [file, setFile] = useState({});
    const [loggedInUserProfile, setLoggedInUserProfile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getUserProfile();
        getCategories();
    }, []);

    const getCategories = async () => {
        let url = `https://deusprogrammer.com/api/jeopardy-svc/categories`;
    
        let res = await axios.get(url, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });
    
        setCategories(res.data.map(({categoryString}) => categoryString));
    }

    const getUserProfile = async () => {
        // If no access token is present, don't retrieve their information
        if (!localStorage.getItem("accessToken")) {
            return;
        }

        try {
            let {data: profile} = await axios.get(`https://deusprogrammer.com/api/profile-svc/users/~self`, {
                headers: {
                    "X-Access-Token": localStorage.getItem("accessToken")
                }
            });

            if (profile.username !== null) {
                setLoggedInUserProfile(profile);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const login = () => {
        if (process.env.NODE_ENV === "development") {
            window.location = `https://deusprogrammer.com/util/auth/dev?redirect=${window.location.protocol}//${window.location.hostname}:${window.location.port}${process.env.PUBLIC_URL}/dev`;
            return;
        }
        window.localStorage.setItem("twitchRedirect", "https://deusprogrammer.com/jeopardy");
        window.location.replace("https://deusprogrammer.com/api/auth-svc/auth/twitch");
    }

    let profileHeader = <button onClick={login}>Login</button>;
    if (loggedInUserProfile) {
        profileHeader = <div>Logged in as {loggedInUserProfile.username}</div>
    }

    const onFileLoaded = (e) => {
        let fr = new FileReader();
        let file = e.target.files[0];

        const uploadFileName = file.name;
        const lastDot = uploadFileName.lastIndexOf('.');
        const ext = uploadFileName.substring(lastDot + 1);

        fr.onload = () => {
            let base64Media = fr.result.substring(fr.result.indexOf(',') + 1);
            setFile({base64Media, uploadFileName, ext, dataUrl: fr.result});
        }

        fr.readAsDataURL(file);
    }

    const setField = (field, value) => {
        let copy = {...card};
        copy[field] = value;
        setCard(copy);
    }

    const storeMedia = async (mediaObject) => {
        let url = `https://deusprogrammer.com/api/img-svc/media`;
    
        let res = await axios.post(url, mediaObject, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });
    
        return res.data;
    }

    const storeCard = async (card) => {
        let url = `https://deusprogrammer.com/api/jeopardy-svc/cards`;
    
        let res = await axios.post(url, card, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });
    
        return res.data;
    }

    const createCategory = async () => {
        setIsSaving(true);
        let url = `https://deusprogrammer.com/api/jeopardy-svc/categories`;
    
        let res = await axios.post(url, {categoryString}, {
            headers: {
                "X-Access-Token": localStorage.getItem("accessToken")
            }
        });

        setCategoryString("");
        setIsSaving(false);
    
        return res.data;
    }

    const createCard = async () => {
        setIsSaving(true);
        let mediaUrl;
        let type;
        if (file.base64Media) {
            if (file.ext === "mp4") {
                type = "video";
            } else if (file.ext === "mp3") {
                type = "audio";
            } else {
                type = "image"
            }

            let mediaObject = {
                mimeType: `${type}/${file.ext}`,
                imagePayload: file.base64Media,
                title: file.uploadFileName
            }

            let m = await storeMedia(mediaObject);
            mediaUrl = `https://deusprogrammer.com/api/img-svc/media/${m._id}/file`;
        }
        await storeCard({...card, mediaUrl, type});
        setCard(EMPTY_CARD);
        setIsSaving(false);
    }

    if (isSaving) {
        return (
            <div style={{position: "absolute", width: "100%", top: "50%", textAlign: "center", transform: "translateY(-50%)"}}>
                Saving...
            </div>
        )
    }

    return (
        <div id="create-page">
            <div style={{textAlign: "right"}}>
                {profileHeader}
            </div>
            <h2>Create Card</h2>
            <div id="create-form">
                <label htmlFor='answer-field'>Answer</label>
                <input id='answer-field' type="text" onChange={({target: {value}}) => {setField('answer', value)}} value={card.answer} />
                <label htmlFor='question-field'>Question</label>
                <input id='question-field' type="text" onChange={({target: {value}}) => {setField('question', value)}} value={card.question} />
                <label htmlFor='difficulty-field'>Difficulty</label>
                <input id='difficulty-field' type="number" onChange={({target: {value}}) => {setField('difficulty', value)}} value={card.difficulty} />
                <label htmlFor='category-field'>Category</label>
                <select id='category-field' type="text" onChange={({target: {value}}) => {setField('category', value)}} value={card.category}>
                    <option>Misc</option>
                    {categories.map((category) => {
                        return <option>{category}</option>
                    })}
                </select>
                <label htmlFor='media-field'>Media</label>
                <input id='media-field' type="file" accept=".mp4,.mp3,.png,.jpg" onChange={onFileLoaded} />
            </div>
            <button type="button" onClick={createCard}>Submit</button>
            <h2>Create Category</h2>
            <div id="create-form">
                <label htmlFor='create-category-field'>Category</label>
                <input id='create-category-field' type="text" onChange={({target: {value}}) => {setCategoryString(value)}} value={categoryString} />
            </div>
            <button type="button" onClick={createCategory}>Submit</button>
        </div>
    )
}