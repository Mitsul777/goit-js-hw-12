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
const itemsPerPage = 40; // Количество изображений на странице
const form = document.querySelector('form');
const searchInput = document.getElementById('searchInput');
const galleryContainer = document.getElementById('gallery');
const loader = document.getElementById('loader');
const loadMoreButton = document.getElementById('loadMore');

form.addEventListener('submit', async function (event) {
  event.preventDefault();
  loader.classList.add('visible');

  const apiKey = '41459044-8203682bce4ef2c3a7a872845';
  const searchQuery = searchInput.value.trim();  // Отримуємо значення з текстового поля та видаляємо зайві пробіли

  // Перевіряємо, чи введений пошуковий запит
  if (searchQuery !== "") {
    const imageType = 'photo'; // Значення параметра image_type
    const orientation = 'horizontal'; // Значення параметра orientation
    const safeSearch = true; // Значення параметра safesearch
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&page=${currentPage}&per_page=${itemsPerPage}`;
    try {
      const response = await axios.get(apiUrl); // Использование Axios для HTTP-запроса
      const images = response.data.hits;

      if (images.length > 0) {
        const imagesMarkup = createMarkup(images);

        // Перевіряємо, чи це перша сторінка, і відповідно вставляємо HTML або додаємо до існуючого
        galleryContainer.innerHTML = currentPage === 1 ? imagesMarkup : galleryContainer.innerHTML + imagesMarkup;

        const lightbox = new SimpleLightbox('.image-card a');

        // Показуємо або приховуємо кнопку "Load more..." в залежності від наявності наступної сторінки
        if (images.length === itemsPerPage) {
          loadMoreButton.style.display = 'block';
        } else {
          loadMoreButton.style.display = 'none';
        }

        // Додаємо обробник подій на кнопку "Load more..."
        loadMoreButton.addEventListener('click', async function (event) {
          event.preventDefault();
          currentPage++;
          await loadMoreImages();
        });
      } else {
        loadMoreButton.style.display = 'none';
      }
    } catch (error) {
      console.error("Помилка при виконанні запиту:", error);
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

async function loadMoreImages() {
  loader.classList.add('visible');

  const apiKey = '41459044-8203682bce4ef2c3a7a872845';
  const searchQuery = searchInput.value.trim();
  const imageType = 'photo';
  const orientation = 'horizontal';
  const safeSearch = true;
  const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${searchQuery}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&page=${currentPage}&per_page=${itemsPerPage}`;

  try {
    const response = await axios.get(apiUrl);
    const images = response.data.hits;

    if (images.length > 0) {
      const imagesMarkup = createMarkup(images);
      galleryContainer.innerHTML += imagesMarkup;
      const lightbox = new SimpleLightbox('.image-card a');

      // Показуємо або приховуємо кнопку "Load more..." в залежності від наявності наступної сторінки
      if (images.length === itemsPerPage) {
        loadMoreButton.style.display = 'block';
      } else {
        loadMoreButton.style.display = 'none';
      }
    } else {
      loadMoreButton.style.display = 'none';
    }
  } catch (error) {
    console.error("Помилка при виконанні запиту:", error);
  } finally {
    loader.classList.remove('visible');
  }
}
