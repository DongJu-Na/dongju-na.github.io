const feedContainer = document.getElementById('feed');
const loader = document.getElementById('loader');
const RSS_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://djlife.tistory.com/rss';
const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';

fetch(RSS_URL)
  .then(res => res.json())
  .then(data => {
    const items = data.items || [];

    if (items.length === 0) {
      loader.textContent = '게시물이 없습니다.';
      return;
    }

    items.slice(0, 50).forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      const thumbnail = item.thumbnail && item.thumbnail.startsWith('http') 
        ? item.thumbnail 
        : fallbackImage;

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

    loader.remove();
  })
  .catch(err => {
    console.error(err);
    loader.textContent = '피드를 불러오는 데 실패했습니다 😢';
  });
