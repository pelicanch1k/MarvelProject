import {Component} from 'react';

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
        charEnded: false
    }

    _marvelService = new MarvelService();

    checkPosition = () => {
        // Высота документа и экрана
        const height = document.body.offsetHeight
        const screenHeight = window.innerHeight
      
        // Сколько пикселей уже проскроллили
        const scrolled = window.scrollY
      
        // Порог
        const threshold = height - screenHeight / 4
        // console.log(threshold)
      
        // Низ экрана относительно страницы
        const position = scrolled + screenHeight
        // console.log(position)
      
        if (position >= threshold) {
            this.onRequest()
        }
      }

    throttle(callee, timeout) {
        let timer = null

        return function perform(...args) {
          if (timer) return

          timer = setTimeout(() => {
            callee(...args)

            clearTimeout(timer)
            timer = null
          }, timeout)

        }
      }

    componentDidMount = () => {
        this.onRequest()
        const {throttle, checkPosition} = this
        
        setTimeout(() => {
            window.addEventListener("scroll", throttle(checkPosition, 1000))
        }, 1000)
    }

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

    createItem = (char) => {
        let {name, src, id} = char

        if (src.indexOf("image_not_available.jpg") !== -1){
            src = abyss
        }

        return (
            <li 
            key={id} 
            className="char__item"
            onClick={() => this.props.onCharSelected(id)}>
                <img src={src} alt={name} />
                <div className="char__name">{name}</div>
            </li>
    )}

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

export default CharList;