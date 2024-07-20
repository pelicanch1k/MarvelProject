import { useState, useEffect, useRef } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from "../skeleton/Skeleton";

import './charInfo.scss';

const CharInfo = (props) => {
    const [char, setChar] = useState(null)

    const oldCharId = useRef(null)

    const {loading, error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [])

    useEffect(() => {
        if (oldCharId.current !== props.charId){
            updateChar();
        }
    }, [props.charId])

    const updateChar = () => {
        const {charId} = props;

        if(!charId){
            return;
        }
        
        oldCharId.current = props.charId
        
        clearError()
        getCharacter(charId)
        .then(char => setChar(char))
    }
    
    const skeleton = char || loading || error ? null : <Skeleton/>
    const loadingMessage = loading ? <Spinner/> : null
    const errorMessage = error ? <ErrorMessage/> : null
    let content = null

    if (loadingMessage == null && 
        errorMessage == null &&
        skeleton == null){
        content = <View char={char}/>
    }

    return (
        <div className="char__info">
            {skeleton}
            {loadingMessage}
            {errorMessage}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {name, description, src, homepage, wiki, comics} = char

    const length = comics.length <= 10 ? comics.length : 10
    const charList = []
    for (let i = 0; i < length; i++) {
        charList.push((
        <li key={i} className="char__comics-item">
            {comics[i].name} #{i+1}
        </li>
        ))
    }

    let style = {objectFit: "cover"}
    if (src.indexOf("image_not_available.jpg") !== -1){
        style.objectFit = "contain"
    }

    return (
        <>
        <div className="char__basics">
            <img style={style} src={src} alt={name} />
            <div>
                <div className="char__info-name">{name}</div>
                <div className="char__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
                <div className="char__descr">{description}</div>
                <div className="char__comics">{comics.length ? "Comics:" : "No Comics"}</div>
                <ul className="char__comics-list">{charList}</ul>
            </>
    )
}

export default CharInfo;