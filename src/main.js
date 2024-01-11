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
const itemsPerPage = 10; // Количество изображений на странице
const form = document.querySelector('form');
const searchInput = document.getElementById('searchInput');
const galleryContainer = document.getElementById('gallery');
const loader = document.getElementById('loader');

form.addEventListener('submit', async function(event) {
  event.preventDefault(); // Передбачаємо стандартну дію форми (відправку)


  loader.classList.add('visible');

  const apiKey = '41459044-8203682bce4ef2c3a7a872845';
  const searchQuery = searchInput.value.trim();  // Отримуємо значення з текстового поля та видаляємо зайві пробіли

  // Перевіряємо, чи введений пошуковий запит
  if (searchQuery !== "") {
    const imageType = 'photo'; // Значення параметра image_type
    const orientation = 'horizontal'; // Значення параметра orientation
    const safeSearch = true; // Значення параметра safesearch
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}`;


    // Показати loader перед початком запиту
    // loader.style.display = 'block';

    try {
      const response = await axios.get(apiUrl); // Использование Axios для HTTP-запроса
      const images = response.data.hits;

      const imagesMarkup = createMarkup(images);

      galleryContainer.innerHTML = imagesMarkup;
      const lightbox = new SimpleLightbox('.image-card a');
      // Отобразим кнопку "Load more..." после успешной загрузки изображений
      const loadMoreButton = document.getElementById('loadMore');
      loadMoreButton.style.display = 'block';
      loadMoreButton.addEventListener('click', async  function(event) {
        event.preventDefault();

      })
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
    } finally {
      loader.classList.remove('visible');
      form.reset();
    }
  } else {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
    });
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


