import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const instance = axios.create({
  baseURL: BASE_URL,
});

class ApiService {
  #API_KEY = '24468918-f1629215ca3337ba51b4044a7';
  #page = 1;
  #per_page = 40;
  searchQuery = 'cat';

  getApiUrl() {
    const queryParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      safesearch: true,
      per_page: this.#per_page,
    });

    return `${BASE_URL}?${queryParams}`;
  }

  async fetchImages() {
    const queryParams = new URLSearchParams({
      key: this.#API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      safesearch: true,
      per_page: this.#per_page,
      page: this.#page,
    });

    const { data } = await instance.get('', {
      params: queryParams,
    });

    return data;
  }

  changeSearchQuery(newQuery) {
    this.searchQuery = newQuery;
    this.#page = 1;
  }

  incrementPage() {
    this.#page += 1;
  }

  get page() {
    return this.#page;
  }

  calcTotalPages(totalHits) {
    return Math.ceil(totalHits / this.#per_page);
  }
}

export default ApiService;
