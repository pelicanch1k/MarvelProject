import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import MarvelService from '../../services/MarvelService';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

const CharList = (props) => {
    const [state, setState] = useState({
        marvelCharacters: [],
        error: false,
        loading: false,
        offset: 210,
        charEnded: false,
        refID: null,
        oldId: null
    })

    let myRef = useRef([]);

    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest()
    }, [])

    const onRequest = useCallback(() => {
        onCharListLoading();

        marvelService.getAllCharacters(state.offset)
        .then(onCharListLoaded)
        .catch(onError)
    }, [state.offset])

    const onCharListLoading = () => {
        setState( prev => ({
            ...prev,
            loading: true
        }))
    }

    const onCharListLoaded = (newMarvelCharacters) => {
        setState(prev => {
            const {marvelCharacters, offset} = prev

            return {
                ...prev, 
                marvelCharacters: [...marvelCharacters, ...newMarvelCharacters],
                loading: false,
                offset: offset + 9,
                charEnded: newMarvelCharacters.length < 9 ? true : false
            }
        })
    }

    const onError = () => {
        setState(prev => ({...prev, error: true}))
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


    const {marvelCharacters, error, loading, charEnded} = state

    if (error){
        return <ErrorMessage/>
    }

    return (
        <div className="char__list">
            <ul className="char__grid">
                {!marvelCharacters ? <Spinner/> : marvelCharacters.map(createItem)}
            </ul>
            <button
            className="button button__main button__long"
            disabled={loading}
            style={{"display": charEnded ? "none" : "block"}}
            onClick={onRequest}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}


CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;