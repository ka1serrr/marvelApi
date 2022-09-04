import './charList.scss';
import {Component} from 'react';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner"
import CharInfo from "../charInfo/CharInfo";
import PropTypes from "prop-types"

class CharList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            heroes: [],
            loading: true,
            newItemLoading: false,
            offset: 210,
            onHeroesEnded: false
        }
    }

    showElemenyByScroll = () => {
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
            this.onRequest(this.state.offset)
        }
    }

    componentDidMount () {
        this.onRequest();
        window.addEventListener('scroll', this.showElemenyByScroll)
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.showElemenyByScroll)
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelCharacters
            .getAllCharacters(offset)
            .then(this.onLoadedList)
    }

    onCharListLoading = () => {
        this.setState({newItemLoading: true})
    }

    marvelCharacters = new MarvelService();

    onLoadedList = (newHeroes) => {
        let ended = false;
        if (newHeroes.length < 9) {
            ended = true
        }

        this.setState(({heroes, offset}) => ({
            heroes: [...heroes, ...newHeroes],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            onHeroesEnded: ended
        }))
    }





    render() {
        const {loading, offset, newItemLoading, onHeroesEnded} = this.state
        const marvelHeroes = this.state.heroes.map((hero, i)=> {
            let objectFitStyle = {
                'objectFit': 'cover'
            }
            if (hero.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                objectFitStyle = {
                    'objectFit': 'contain'
                }
            }
            return (
                <li
                    onClick={() => this.props.onCharSelected(hero.id)}
                    key={hero.id}
                    className="char__item">
                        <img src={hero.thumbnail} alt="abyss" style={objectFitStyle}/>
                        <div className="char__name">{hero.name}</div>
                </li>
            )
        })

        const spinner = loading ? <Spinner></Spinner> : null
        const hero = !loading ? marvelHeroes : null
        return (
            <div className="char__list">
                    {spinner}
                <ul className="char__grid">
                    {hero}
                </ul>

                <button className="button button__main button__long" disabled={newItemLoading} style={{'display': onHeroesEnded ? 'none' : 'block'}}>
                    <div className="inner"  onClick={() => this.onRequest(offset)}>load more</div>
                </button>
            </div>
        )
    }
}
CharInfo.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;