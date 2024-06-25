import {Component} from 'react';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    constructor(props) {
        super(props);

        this._marvelService = new MarvelService();
        this.state = {
            marvelCharacters: []
        }
    }

    createItem = (char, index) => {
        let {name, desc, src} = char

        if (src.indexOf("image_not_available.jpg") !== -1){
            src = abyss
        }

        return (
            <li key={index} className="char__item">
                <img src={src} alt={name} />
                <div className="char__name">{name}</div>
            </li>
    )}

    componentDidMount = () => {
        this._marvelService.getAllCharacters(9).then(res => {
            return res.map(this.createItem)
        }).then(marvelCharacters => this.setState({marvelCharacters}))
    }

    render() {
        const {marvelCharacters} = this.state  

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {marvelCharacters}
                    {/* <li className="char__item">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li> */}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;