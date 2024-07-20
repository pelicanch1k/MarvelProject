import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import useMarvelService from '../../services/MarvelService';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

const CharList = (props) => {
    const [state, setState] = useState({
        marvelCharacters: [],
        offset: 210,
        charEnded: false,
        refID: null,
        oldId: null,
        newItemLoading: false
    })

    // const [newItemLoading, setNewItemLoading] = useState(false);

    let myRef = useRef([]);

    const {loading, error, getAllCharacters} = useMarvelService();

    useEffect(() => {
        onRequest(true)
    }, [])

    const onRequest = (initial) => {
        setState(prev => {
            return {...prev, newItemLoading: initial ? false : true}
        })

        getAllCharacters(state.offset)
        .then(onCharListLoaded)
    }

    const onCharListLoaded = (newMarvelCharacters) => {
        setState(prev => {
            const {marvelCharacters, offset} = prev

            return {
                ...prev, 
                marvelCharacters: [...marvelCharacters, ...newMarvelCharacters],
                offset: offset + 9,
                charEnded: newMarvelCharacters.length < 9 ? true : false
            }
        })
    }

    const onCharSelected = (id) => {
        setState(prev => ({...prev, refID: id}))
        props.onCharSelected(id)
    }

    const setRef = elem => {
        myRef = elem
    }


    const createItem = (char) => {
        let {name, src, id} = char

        if (src.indexOf("image_not_available.jpg") !== -1){
            src = abyss
        }

        if (id == state.refID){
            return (
                <li
                ref={setRef}
                key={id} 
                className="char__item char__item_selected"
                tabIndex={0}>
                    <img src={src} alt={name} />
                    <div className="char__name">{name}</div>
                </li>
            )
        } else {
            return (
                <li
                key={id} 
                className="char__item"
                tabIndex={0}
                onClick={() => onCharSelected(id)}>
                    <img src={src} alt={name} />
                    <div className="char__name">{name}</div>
                </li>
            )
        }
    }

    const items = state.marvelCharacters.map(createItem)

    const errorMessage = error ? <ErrorMessage/> : null
    const spinner = loading && !state.newItemLoading ? <Spinner/> : null

    return (
        <div className="char__list">
            <ul className="char__grid">
                {errorMessage}
                {spinner}
                {items}
            </ul>
            <button
                className="button button__main button__long"
                disabled={loading}
                style={{"display": state.charEnded ? "none" : "block"}}
                onClick={() => onRequest(false)}>
                    <div className="inner">load more</div>
            </button>
        </div>
    )
}


CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;