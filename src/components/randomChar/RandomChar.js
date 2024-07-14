import {  useEffect, useState } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spiner/Spinner';
import ErrorMessage from "../errorMessage/ErrorMessage"

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
    const [state, setState] = useState({
        oldChar: {},
        char: {},
        loading: true,
        error: false
    })

    const marvelService = new MarvelService();

    useEffect( () => { 
        updateChar()
    }, [])

    useEffect( () => {
        const name = state.char.name;
        const oldName = state.oldChar.name;

        if (name && oldName){
            if (name === oldName){
                updateChar();
            }
        }
    }, [state])

    const onError = () => {
        setState(prev => ({
            ...prev,
            loading: false,
            error: true 
        }))
    }

    const onCharLoaded = (char) => {
        setState(prev => ({
            ...prev,
            char,
            loading: false,
            error: false
        }))
    }

    const onCharLoading = () => {
        setState(prev => ({
            ...prev,
            char: {},
            oldChar: prev.char,
            loading: true,
            error: false
        }))
    }

    const updateChar = () => {
        onCharLoading()

        const id = Math.floor(Math.random() * (1011400 - 1011410) + 1011410)

        marvelService
        .getCharacter(id)
        .then(onCharLoaded)
        .catch(onError)
    }

    const {char, loading, error} = state;
    
    const loadingMessage = loading ? <Spinner/> : null
    const errorMessage = error ? <ErrorMessage/> : null
    let content = null

    if (loadingMessage == null && errorMessage == null){
        content = <View char={char}/>
    }

    return (
        <div className="randomchar">
            {loadingMessage}
            {errorMessage}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main" onClick={updateChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
}

const View = ({char}) => {
    const {name, description, src, homepage, wiki} = char;
    let style = {objectFit: "cover"}

    if (src.indexOf("image_not_available.jpg") !== -1){
        style.objectFit = "contain"
    }

    return (
        <div className="randomchar__block">
            <img style={style} src={src} alt="Random character" className="randomchar__img"/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;