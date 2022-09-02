import {Component} from 'react';

import './charInfo.scss';
import Spinner from "../spinner/Spinner";
import ErrorMessage from '../errorMesage/ErrorMessage'
import MarvelService from "../../services/MarvelService";
import Skeleton from '../skeleton/Skeleton'

class CharInfo extends Component{
    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();
    // Вызывается один раз при запуске страницы, поэтому при нажатии не происходит перерисовка. Для этого нужен didUpdate.

    componentDidMount() {
        this.updateChar()
    }
    // В качестве аргументов он получает prevProps и prevState => он получает предыдущие пропсы и стейты, перед тем как он отрисуется еще раз. Это делается для того, чтобы сравнивать их с новыми.
    componentDidUpdate(prevProps,prevState) {
        if(this.props.charId !== prevProps.charId) {     // Если новые пропсы не равны старым то тогда будет перерисован компонент
            this.updateChar()
        }
    }

    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }
        this.onCharLoading()
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (char) => {
        this.setState({char, loading: false, error: false});
    }
    onCharLoading = () => {
        this.setState({loading: true})
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }

    render() {
        const {char, loading, error} = this.state

        const skeleton = char || loading || error ? null : <Skeleton>N</Skeleton>
        const errorMessage = error ? <ErrorMessage></ErrorMessage> : null;
        const spinner = loading ? <Spinner></Spinner> : null;
        const content = !(loading  || error || !char) ? <View char={char}></View> : null;

        return (
            <div className="char__info">
                {skeleton}
                {errorMessage}
                {spinner}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = char
    let styleSrc = {
        'objectFit': 'cover',
    }

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        styleSrc = {
            'objectFit': 'contain'
        }
    }
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={styleSrc}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? 'There is no comics with this character' :
                    comics.slice(0, 10).map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })}

            </ul>
        </>
    )
}

export default CharInfo;