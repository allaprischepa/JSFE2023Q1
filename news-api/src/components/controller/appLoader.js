import Loader from './loader';

class AppLoader extends Loader {
    constructor() {
        super('https://newsapi.org/v2/', {
            apiKey: 'e738afbb060f488bb66621a6b75efacc', // получите свой ключ https://newsapi.org/
        });
    }
}

export default AppLoader;
