// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";
// Описаний у документації
import SimpleLightbox from "simplelightbox";
// Импортируем библиотеку Axios
import axios from 'axios';
// Додатковий імпорт стилів
import "simplelightbox/dist/simple-lightbox.min.css";

let currentPage = 1; // Инициализация текущей страницы
let isLastPage = false;
let searchQuery;
const itemsPerPage = 40; // Количество изображений на странице
const form = document.querySelector('form');
const searchInput = document.getElementById('searchInput');
const galleryContainer = document.getElementById('gallery');
const loader = document.getElementById('loader');
const loadMoreButton = document.getElementById('loadMore');

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  currentPage = 1;
  galleryContainer.innerHTML = '';
  loader.classList.remove('hide')
  loadMoreButton.style.display = 'none';
  const apiKey = '41459044-8203682bce4ef2c3a7a872845';
  searchQuery = searchInput.value.trim();  // Отримуємо значення з текстового поля та видаляємо зайві пробіли

  // Перевіряємо, чи введений пошуковий запит
  if (searchQuery === "") {
    loader.classList.add('hide');
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
    return;
  }

    const imageType = 'photo'; // Значення параметра image_type
    const orientation = 'horizontal'; // Значення параметра orientation
    const safeSearch = true; // Значення параметра safesearch
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&page=${currentPage}&per_page=${itemsPerPage}`;
    try {
      const response = await axios.get(apiUrl); // Использование Axios для HTTP-запроса
      const images = response.data.hits;

      if (images.length > 0) {
        const imagesMarkup = createMarkup(images);
        loader.classList.add('hide')


        galleryContainer.insertAdjacentHTML('beforeend', imagesMarkup);

        const lightbox = new SimpleLightbox('.image-card a');

        if (images.length === itemsPerPage) {
          loadMoreButton.style.display = 'block';
          // loader.style.display = 'none';
        } else {
          loadMoreButton.style.display = 'none';
          iziToast.info({
            message: 'We are sorry, but you reached the end of search results.',
            position: 'topRight',
          });

          // loader.classList.remove('none');
        }

        // Додаємо обробник подій на кнопку "Load more..."
        loadMoreButton.addEventListener('click', async function (event) {
          currentPage++;
          await loadMoreImages();
        });
      } else {
        loadMoreButton.style.display = 'none';
      }
    } catch (error) {
      console.error("Помилка при виконанні запиту:", error);
    } finally {
      // loader.classList.remove('visible');
      form.reset();
    }
});

function createMarkup(imgArr) {
  return imgArr.map(({ webformatURL, tags, likes, views, comments, downloads }) => `
    <div class="image-card">
      <a href="${webformatURL}" class="lightbox-trigger">
        <img src="${webformatURL}" alt="${tags}">
      </a>
      <div class="image-details">
        <p><strong>Likes:</strong> ${likes}</p>
        <p><strong>Views:</strong> ${views}</p>
        <p><strong>Comments:</strong> ${comments}</p>
        <p><strong>Downloads:</strong> ${downloads}</p>
      </div>
    </div>
  `).join('');
}

async function loadMoreImages() {
  const apiKey = '41459044-8203682bce4ef2c3a7a872845';
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safeSearch = true;
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&page=${currentPage}&per_page=${itemsPerPage}`;
  try {
    loader.classList.remove('hide')
    const response = await axios.get(apiUrl);
    const images = response.data.hits;

    if (images.length > 0) {
      const imagesMarkup = createMarkup(images);
      galleryContainer.insertAdjacentHTML('beforeend', imagesMarkup);
      galleryContainer.insertAdjacentHTML('beforeend', imagesMarkup);
      const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      })
      const lightbox = new SimpleLightbox('.image-card a');

      const totalPages = Math.ceil(response.data.totalHits / itemsPerPage);

      if (currentPage >= totalPages) {
        loadMoreButton.style.display = 'none';
        isLastPage = true;
        loader.classList.add('hide')

        iziToast.info({
          message: 'We are sorry, but you reached the end of search results.',
          position: 'topRight',
        });
      } else {
        loadMoreButton.style.display = 'block';
      }

      // Вызываем метод refresh() на экземпляре SimpleLightbox
      lightbox.refresh();
    } else {
      loadMoreButton.style.display = 'none';
    }
  } catch (error) {
    console.error("Помилка при виконанні запиту:", error);
  } finally {
    loader.classList.add('hide')
  }
}

