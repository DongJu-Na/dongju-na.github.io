const feedContainer = document.getElementById('feed');
const loader = document.getElementById('loader');
const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://djlife.tistory.com/rss';

let items = [];
let page = 0;
const pageSize = 3; // 한 번에 보여줄 개수
const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';

function loadMore() {
  const start = page * pageSize;
  const end = start + pageSize;
  const sliced = items.slice(start, end);

  sliced.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';

    const thumbnail = item.thumbnail && item.thumbnail.startsWith('http') ? item.thumbnail : fallbackImage;
    const content = `
      <a href="${item.link}" target="_blank">
        <img src="${thumbnail}" alt="${item.title}" onerror="this.src='${fallbackImage}'">
      </a>
      <div class="content">
        <div class="title">${item.title}</div>
        <div class="date">${new Date(item.pubDate).toLocaleDateString()}</div>
      </div>
    `;
    card.innerHTML = content;
    feedContainer.appendChild(card);
  });

  page++;
  if (page * pageSize >= items.length) {
    loader.textContent = '더 이상 글이 없습니다.';
    window.removeEventListener('scroll', handleScroll);
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    loadMore();
  }
}

fetch(RSS_URL)
  .then(res => res.json())
  .then(data => {
    items = data.items || [];
    if (items.length === 0) {
      loader.textContent = '게시물이 없습니다.';
    } else {
      loadMore();
      window.addEventListener('scroll', handleScroll);
    }
  })
  .catch(err => {
    console.error(err);
    loader.textContent = '피드를 불러오는 데 실패했습니다 😢';
  });
