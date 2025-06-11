const feedContainer = document.getElementById('feed');
const loader = document.getElementById('loader');

const RSS_URL = 'https://djlife.tistory.com/rss';
const PROXY_URL = `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`;

const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930';

fetch(PROXY_URL)
  .then(res => res.text())
  .then(str => {
    const parser = new DOMParser();
    const xml = parser.parseFromString(str, "application/xml");

    const channel = xml.querySelector("channel");
    if (!channel) throw new Error("채널 없음");

    const items = [...channel.querySelectorAll("item")].slice(0, 50);

    if (items.length === 0) {
      loader.textContent = '게시물이 없습니다.';
      return;
    }

    items.forEach(item => {
      const title = item.querySelector("title")?.textContent || "제목 없음";
      const link = item.querySelector("link")?.textContent || "#";
      const pubDate = new Date(item.querySelector("pubDate")?.textContent || "").toLocaleDateString();

      let imgSrc = fallbackImage;
      const content = item.querySelector("content\\:encoded")?.textContent || item.querySelector("description")?.textContent;

      if (content) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;
        const img = tempDiv.querySelector("img");
        if (img && img.src) imgSrc = img.src;
      }

      const card = document.createElement('div');
      card.className = 'card';

      const html = `
        <a href="${link}" target="_blank">
          <img src="${imgSrc}" alt="${title}" onerror="this.src='${fallbackImage}'">
        </a>
        <div class="content">
          <div class="title">${title}</div>
          <div class="date">${pubDate}</div>
        </div>
      `;

      card.innerHTML = html;
      feedContainer.appendChild(card);
    });

    loader.remove();
  })
  .catch(err => {
    console.error(err);
    loader.textContent = '피드를 불러오는 데 실패했습니다 😢';
  });

