import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spiner/Spinner';
import ErrorMessage from "../errorMessage/ErrorMessage"

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props){
        super(props);

        this.state = {
            char: {},
            loading: true,
            error: false
        }
    
        this.marvelService = new MarvelService();

        this.updateChar();
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true 
        })
    }

    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading: false})
    }

    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011440) + 1011440) 

        this.marvelService
        .getCharacter(id)
        .then(this.onCharLoaded)
        .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state;
        
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
                    <button className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, src, homepage, wiki} = char;

    return (
        <div className="randomchar__block">
            <img src={src} alt="Random character" className="randomchar__img"/>
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