import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import refs from './servises/refs';
import ApiService from './servises/api-service';
import { renderMarkupGalleryImgs } from './components/imgs-markup';

const api = new ApiService();
const lightbox = new SimpleLightbox('.gallery a', {
  animationSpeed: 300,
});

const renderGalleryImages = async () => {
  try {
    const { hits, totalHits } = await api.fetchImages();

    if (!hits.length) {
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (api.page === 1) {
      Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    renderMarkupGalleryImgs(refs.gallery, hits);
    lightbox.refresh();
    showBtnLoadMore(totalHits);
  } catch (error) {
    Notify.failure('Something went wrong');
  }
};

function onSearchInfo(e) {
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
  reset();
  renderGalleryImages();
}

function onShowMorePictures(e) {
  api.incrementPage();

  renderGalleryImages().then(smoothScroll);
}

refs.searchForm.addEventListener('submit', onSearchInfo);
refs.btnLoadMore.addEventListener('click', onShowMorePictures);

function reset() {
  refs.gallery.innerHTML = '';
  refs.btnLoadMore.classList.add('is-hidden');
}

function showBtnLoadMore(totalHits) {
  const totalPages = api.calcTotalPages(totalHits);

  if (totalPages > 1 && api.page !== totalPages) {
    refs.btnLoadMore.classList.remove('is-hidden');
  }

  if (totalPages > 1 && api.page === totalPages) {
    refs.btnLoadMore.classList.add('is-hidden');
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
