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

    createItems = () => {
        // const arr = [] 

        // this._marvelService.getAllCharacters(9).then(res => {
        //     res.data.results.forEach(item => {
        //         arr.push(
        //             <li className="char__item">
        //                 <img src={abyss} alt="abyss"/>
        //                 <div className="char__name">{item.name}</div>
        //             </li>
        //         )
        //     })
        // })

        const arr = []

        this._marvelService.getAllCharacters(9).then(res => {
            return res.data.results
        }).then(results => {
            arr.push(results)
        })

        while (arr.length === 0){
            console.log(1)
        }
        return 
    }

    createItem = (name) => {
        return (
            <li className="char__item">
                <img src={abyss} alt="abyss"/>
                <div className="char__name">{name}</div>
            </li>
    )}

    render() {
        return (
            <div className="char__list">
                <ul className="char__grid">
                    <li className="char__item">
                        <img src={abyss} alt="abyss"/>
                        <div className="char__name">Abyss</div>
                    </li>
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;