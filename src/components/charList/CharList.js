import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spiner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import MarvelService from '../../services/MarvelService';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    state = {
        marvelCharacters: [],
        error: false,
        loading: false,
        offset: 210,
        charEnded: false,
        refID: null,
        oldId: null
    }

    _marvelService = new MarvelService();

    setRef = elem => {
        this.myRef = elem
    }

    componentDidMount = () => {
        this.onRequest()
    }

    // componentDidUpdate = (prevProps, prevState) => {
    //     // this.myRef?.classList.add("char__item_selected")
    // }

    onRequest = () => {
        this.onCharListLoading();

        this._marvelService.getAllCharacters(this.state.offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            loading: true
        })
    }

    onCharListLoaded = (newMarvelCharacters) => {
        this.setState(({marvelCharacters, offset}) => ({    
            marvelCharacters: [...marvelCharacters, ...newMarvelCharacters],
            loading: false,
            offset: offset + 9,
            charEnded: newMarvelCharacters.length < 9 ? true : false
        }))
    }

    onError = () => {
        this.setState({error: true})
    }

    onCharSelected = (id) => {
        this.setState({refID: id})
        this.props.onCharSelected(id)
    }

    createItem = (char, index) => {
        let {name, src, id} = char

        if (src.indexOf("image_not_available.jpg") !== -1){
            src = abyss
        }


        if (id == this.state.refID){
            return (
                <li
                ref={this.setRef}
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
                onClick={() => this.onCharSelected(id)}>
                    <img src={src} alt={name} />
                    <div className="char__name">{name}</div>
                </li>
            )
        }
    }

    render() {
        const {marvelCharacters, error, loading, charEnded} = this.state

        if (error){
            return <ErrorMessage/>
        }

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {!marvelCharacters ? <Spinner/> : marvelCharacters.map(this.createItem)}
                </ul>
                <button
                className="button button__main button__long"
                disabled={loading}
                style={{"display": charEnded ? "none" : "block"}}
                onClick={this.onRequest}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;