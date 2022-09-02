import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import {Component} from 'react';
import MarvelService from '../../services/MarvelService';
import ErrorMessage from "../errorMesage/ErrorMessage";
import Spinner from '../spinner/Spinner'



class RandomChar extends Component {
    state = {
        char: {},
        loading: true,
        error: false
    }


    marvelService = new MarvelService();
    // Для работы с серверами идеально подходит хук compontentDidMount();
    componentDidMount() {
        this.updateChar();
    }
    componentWillUnmount() {
        clearInterval(this.timerId);
    }


    // Нужне только чтобы менять стейт. По дефолту лоадинг стоит true, когда приходят данные они меняется на false;
    onCharLoaded = (char) => {
        this.setState({char, loading: false, error: false});
    }
    onCharLoading = () => {
        this.setState({loading: true})
    }

    onError = () => {
        this.setState({loading: false, error: true})
    }

    // Здесь мы рандомим айди, затем получаем данные из marvelService и передаём их в onCharLoaded. Если же будет выдана ошибка, то тогда код обратиться к функции onError, которая будет менять стейт error
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharLoading();
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError);
    }

    render () {
        const {char, loading, error} =  this.state;
        // Если у нас будет ошибка, то будет возвращаться она, если нет => нечего. И так везде.
        const errorMessage = error ? <ErrorMessage></ErrorMessage> : null;
        const spinner = loading ? <Spinner></Spinner> : null;
        const content = !(loading  || error) ? <View char={char}></View> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button onClick={this.updateChar} className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;
    let styleSrc = {
        'objectFit': 'cover',
    }

    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        styleSrc = {
            'objectFit': 'contain'
        }
    }

    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className='randomchar__img' style={styleSrc}/>
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