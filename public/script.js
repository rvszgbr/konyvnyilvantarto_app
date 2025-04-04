document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('book-form');
  const bookList = document.getElementById('book-list');
  const idInput = document.getElementById('book-id');
  const titleInput = document.getElementById('title');
  const authorInput = document.getElementById('author');
  const yearInput = document.getElementById('year');
  const categoryInput = document.getElementById('category');
  const descriptionInput = document.getElementById('description');
  const ratingInput = document.getElementById('rating');
  const coverInput = document.getElementById('cover');
  const searchInput = document.getElementById('search');
  const categoryFilter = document.getElementById('category-filter');
  const errorMessage = document.getElementById('error-message');

  const modal = document.getElementById('book-modal');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-title');
  const modalAuthor = document.getElementById('modal-author');
  const modalYear = document.getElementById('modal-year');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalRating = document.getElementById('modal-rating');
  const modalCover = document.getElementById('modal-cover-container');

  modalClose.onclick = () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  window.onclick = event => {
    if (event.target == modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  }

  function showModal(book) {
    modalTitle.textContent = book.title;
    modalAuthor.textContent = book.author;
    modalYear.textContent = book.year;
    modalCategory.textContent = book.category;
    modalDescription.textContent = book.description || '-';
    modalRating.innerHTML = '';
    modalCover.innerHTML = '';

    const stars = parseInt(book.rating || 0);
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement('span');
      star.textContent = '★';
      star.className = 'star' + (i <= stars ? '' : ' gray');
      modalRating.appendChild(star);
    }

    if (book.cover) {
      const img = document.createElement('img');
      img.src = book.cover;
      img.alt = 'Borító';
      img.style.maxWidth = '100%';
      img.style.marginTop = '10px';
      modalCover.appendChild(img);
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function fetchBooks() {
    const search = searchInput.value;
    const category = categoryFilter.value;
    const url = `/api/books?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        bookList.innerHTML = '';
        data.forEach(book => {
          const li = document.createElement('li');
          li.innerHTML = `
            <span class="book-title" style="cursor:pointer; color:blue; text-decoration:underline;">
              ${book.title}
            </span>
            <span>
              <button onclick="editBook(${book.id}, '${book.title}', '${book.author}', ${book.year}, '${book.category || ''}', \`${book.description || ''}\`, ${book.rating || 0})">Szerkesztés</button>
              <button onclick="deleteBook(${book.id})">Törlés</button>
            </span>
          `;
          li.querySelector('.book-title').onclick = () => showModal(book);
          bookList.appendChild(li);
        });
      });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    titleInput.focus();
    const id = idInput.value;
    const formData = new FormData();

    formData.append('title', titleInput.value);
    formData.append('author', authorInput.value);
    formData.append('year', yearInput.value);
    formData.append('category', categoryInput.value);
    formData.append('description', descriptionInput.value);
    formData.append('rating', ratingInput.value);
    if (coverInput.files[0]) {
      formData.append('cover', coverInput.files[0]);
    }

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/books/${id}` : '/api/books';

    try {
      const response = await fetch(url, {
        method,
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        errorMessage.textContent = data.error || 'Hiba történt a mentés során.';
        errorMessage.style.display = 'block';
        return;
      }

      errorMessage.style.display = 'none';
      form.reset();
      idInput.value = '';
      fetchBooks();
    } catch (err) {
      errorMessage.textContent = 'Hálózati hiba történt.';
      errorMessage.style.display = 'block';
    }
  });

  window.deleteBook = function(id) {
    fetch(`/api/books/${id}`, {
      method: 'DELETE'
    }).then(() => fetchBooks());
  }

  window.editBook = function(id, title, author, year, category, description, rating) {
    idInput.value = id;
    titleInput.value = title;
    authorInput.value = author;
    yearInput.value = year;
    categoryInput.value = category;
    descriptionInput.value = description;
    ratingInput.value = rating;
    titleInput.focus();
  }

  searchInput.addEventListener('input', fetchBooks);
  categoryFilter.addEventListener('change', fetchBooks);

  fetchBooks();
});
