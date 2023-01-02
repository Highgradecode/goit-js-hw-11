import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more')

let pageCount;

const getPhotos = async () => {

    const axiosGetPhotos = await axios({
        method: 'get',
        url: 'https://pixabay.com/api/',
        params: {
            key: '32553073-8f4539423fe76466918d85978',
            q: searchForm.elements.searchQuery.value,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            page: pageCount,
            per_page: 40,
        }
    });

    return axiosGetPhotos;
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loadMoreBtn.classList.add('is-hidden')

    pageCount = 1;

    gallery.textContent = '';

    getPhotos().then(photos => {
        if (photos.data.hits.length === 0) {
            
            Notify.failure('Sorry, there are no images matching your search query. Please try again.');
            return;
        }

        makeMarkupPhotoCard(photos.data.hits);

        loadMoreBtn.classList.remove('is-hidden');
    })
})

const makeMarkupPhotoCard = (photosArr) => {

    const markupPhoto = photosArr.map(photo => {
        return `
        <div class="photo-card">
        <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
                <div class="info">
                    <p class="info-item">
                        <b>Likes</b>
                        ${photo.likes}
                    </p>
                    <p class="info-item">
                        <b>Views</b>
                        ${photo.views}
                    </p>
                    <p class="info-item">
                        <b>Comments</b>
                        ${photo.comments}
                    </p>
                    <p class="info-item">
                        <b>Downloads</b>
                        ${photo.downloads}
                        
                    </p>
                </div>
            </div>`
    }).join('')

    gallery.insertAdjacentHTML('beforeend', markupPhoto);
}

loadMoreBtn.addEventListener('click', () => {
    pageCount += 1;

    getPhotos().then(photos => {
        makeMarkupPhotoCard(photos.data.hits);

        if (photos.data.totalHits === gallery.childElementCount) {
            Notify.info("We're sorry, but you've reached the end of search results.");
            loadMoreBtn.classList.add('is-hidden');
        }
    })
})