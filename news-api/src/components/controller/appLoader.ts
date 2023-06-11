import Loader from './loader';

class AppLoader extends Loader {
  constructor() {
    const url = 'https://newsapi.org/v2/';
    const key = 'e738afbb060f488bb66621a6b75efacc';

    super(url, { apiKey: key });
  }
}

export default AppLoader;
