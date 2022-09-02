import './charList.scss';
import {Component} from 'react';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner"

class CharList extends Component{

    constructor(props) {
        super(props);
        this.state = {
            heroes: [],
            loading: true
        }
    }

    componentDidMount () {
        this.updateList();

    }

    marvelCharacters = new MarvelService();

    onLoadedList = (heroes) => {
        this.setState({heroes, loading: false})
    }

    updateList = () => {
        this.marvelCharacters
            .getAllCharacters()
            .then(this.onLoadedList)

    }




    render() {
        const {heroes, loading} = this.state
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

                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;