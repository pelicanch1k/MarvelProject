import {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';
import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';
import uw from '../../resources/img/UW.png';
import xMen from '../../resources/img/x-men.png';

const ComicsList = (props) => {
    const [state, setState] = useState({
            marvelComics: [],
            offset: 0,
            newItemLoading: false
        });

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => onRequest(false), [])

    const onRequest = (newItemLoading) => {
        setState(prev => ({...prev, newItemLoading}))

        getAllComics(state.offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComics) => {
        setState(prev => {
            const {offset, marvelComics} = prev

            return {
                ...prev,
                offset: offset + 8,
                marvelComics: [...marvelComics, ...newComics]
            }
        })
    }

    const createItem = (item, key) => {
        const {src, title, price} = item

        return (
            <li className="comics__item" key={key}>
                <a href="#">
                    <img src={src ? src : uw} alt="ultimate war" className="comics__item-img"/>
                    <div className="comics__item-name">{title}</div>
                    <div className="comics__item-price">{price}</div>
                </a>
            </li>
        )
    }

    const items = state.marvelComics.map(createItem)

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !state.newItemLoading ? <Spinner/> : null

    return (
        <div className="comics__list">
            <ul className="comics__grid">
                {errorMessage}
                {spinner}
                {items}
            </ul>
            <button 
            className="button button__main button__long"
            disabled={loading}
            >
                <div onClick={() => onRequest(true)} className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;