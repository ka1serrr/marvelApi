import errorMessage from './error.gif'

const ErrorMessage = () => {
    return (
        <img style={{display: 'block', width: '250px', height: '250px', objectFit: 'contain', margin: '0 auto'}} src={errorMessage} alt="Eror"/>
    )
}
// process.env.PUBLIC_URL ведёт ссылку на public. Но ссылка делается это очень редко, легче просто переносить картинку в эту же папку.
export default ErrorMessage;
