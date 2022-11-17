import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import refs from './servises/refs';
import ApiService from './servises/api-service';
import { markupList } from './components/imgs-markup';

import InfiniteScroll from 'infinite-scroll';

const FAILURE =
  'Sorry, there are no images matching your search query. Please try again.';
const INFO = "We're sorry, but you've reached the end of search results.";

const resultMessage = info => `Hooray! We found ${info} images.`;

const api = new ApiService();
const lightbox = new SimpleLightbox('.gallery a', {
  animationSpeed: 300,
});

let infScroll = null;

const initInfiniteScroll = () => {
  infScroll = new InfiniteScroll(refs.gallery, {
    path: function () {
      return `${api.getApiUrl()}&page=${this.pageIndex}`;
    },
    history: false,
    responseBody: 'json',
  });

  infScroll.on('load', function ({ hits, totalHits }) {
    const totalPage = api.calcTotalPages(totalHits);

    if (hits.length < 1 && !totalPage) {
      return Notify.failure(FAILURE);
    }

    if (infScroll.pageIndex - 1 > totalPage) {
      infScroll.destroy();
      return Notify.info(INFO);
    }

    if (infScroll.pageIndex - 1 === 1) {
      Notify.success(resultMessage(totalHits));
    }

    const proxyElem = document.createElement('div');
    const itemsHTML = markupList(hits);
    proxyElem.innerHTML = itemsHTML;
    const items = proxyElem.querySelectorAll('.photo-card');
    infScroll.appendItems(items);
    lightbox.refresh();
  });

  infScroll.loadNextPage();
};

initInfiniteScroll();

const resetView = () => {
  refs.gallery.innerHTML = '';
  infScroll.destroy();
};

refs.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  const input = e.currentTarget.elements.searchQuery;
  const searchQuery = input.value.trim();

  if (!searchQuery) {
    Notify.failure('Enter the name of the image to search');
    input.value = '';
    return;
  }

  if (api.searchQuery === searchQuery) {
    return;
  }

  api.changeSearchQuery(searchQuery);
  e.currentTarget.reset();
  resetView();
  initInfiniteScroll();
});
