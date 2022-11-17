const markupElem = ({
  tags,
  likes,
  views,
  comments,
  downloads,
  webformatURL,
  largeImageURL,
} = {}) => `
<div class="photo-card">
<div class="thumb">
<a href="${largeImageURL}">
<img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
</div>
 
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span class="info-text-wrapp">${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span class="info-text-wrapp">${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span class="info-text-wrapp">${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span class="info-text-wrapp">${downloads}</span>
    </p>
    </div>
</div>
`;

const markupList = data => data.map(markupElem).join('');

const renderMarkupGalleryImgs = (domElemLink, data) =>
  domElemLink.insertAdjacentHTML('beforeend', markupList(data));

export { renderMarkupGalleryImgs, markupList };
