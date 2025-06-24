document.addEventListener("DOMContentLoaded", () => {

const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
hamburger.addEventListener('click', () => nav.classList.toggle('open'));


//carousel index - home page
const track = document.getElementById('carouselTrack');
const dotsContainer = document.getElementById('carouselDots');
const cards = track.children;
let index = 0;

function getCardsPerView() {
  return window.innerWidth <= 600 ? 1 : 2;
}

function updateCarousel() {
  const cardsPerView = getCardsPerView();
  const trackWidth = track.offsetWidth;
  const cardWidth = trackWidth / cardsPerView;
  const maxIndex = cards.length - cardsPerView;
  if (index > maxIndex) index = maxIndex < 0 ? 0 : maxIndex;
  if (index < 0) index = 0;

  track.style.transform = `translateX(${-cardWidth * index}px)`;
  updateDots();
}

function createDots() {
  dotsContainer.innerHTML = '';
  const cardsPerView = getCardsPerView();
  const dotsCount = cards.length - cardsPerView + 1;
  for (let i = 0; i < dotsCount; i++) {
    const dot = document.createElement('span');
    dot.classList.add('dotcirclesdiv');
    if (i === index) dot.classList.add('active');
    dot.addEventListener('click', () => {
      index = i;
      updateCarousel();
    });
    dotsContainer.appendChild(dot);
  }
}

function updateDots() {
  const dots = dotsContainer.querySelectorAll('.dotcirclesdiv');
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

window.addEventListener('resize', () => {
  createDots();
  updateCarousel();
});

createDots();
updateCarousel();

let startX = 0;
let currentX = 0;
let isDragging = false;

track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

track.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  currentX = e.touches[0].clientX;
});

track.addEventListener('touchend', (e) => {
  if (!isDragging) return;
  const diffX = startX - currentX;
  const threshold = 50;

  if (diffX > threshold) {
    index++;
  } else if (diffX < -threshold) {
    index--;
  }
  updateCarousel();
  isDragging = false;
});

track.addEventListener('mousedown', (e) => {
  startX = e.clientX;
  isDragging = true;
  e.preventDefault(); 
});

track.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  currentX = e.clientX;
});

track.addEventListener('mouseup', (e) => {
  if (!isDragging) return;
  const diffX = startX - currentX;
  const threshold = 50; 

  if (diffX > threshold) {
    index++;
  } else if (diffX < -threshold) {
    index--;
  }
  updateCarousel();
  isDragging = false;
});

track.addEventListener('mouseleave', () => {
  isDragging = false;
});



//blog page
const trackBlog = document.querySelector('.carouselb-track');
let isDown = false;
let startXBlog;
let scrollLeft;

track.addEventListener('mousedown', (e) => {
  isDown = true;
  track.classList.add('active');
  startX = e.pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
});

track.addEventListener('mouseleave', () => {
  isDown = false;
  track.classList.remove('active');
});

track.addEventListener('mouseup', () => {
  isDown = false;
  track.classList.remove('active');
});

track.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - track.offsetLeft;
  const walk = (x - startX) * 2; 
  track.scrollLeft = scrollLeft - walk;
});

track.addEventListener('touchstart', (e) => {
  startX = e.touches[0].pageX - track.offsetLeft;
  scrollLeft = track.scrollLeft;
});

track.addEventListener('touchmove', (e) => {
  const x = e.touches[0].pageX - track.offsetLeft;
  const walk = (x - startX) * 2;
  track.scrollLeft = scrollLeft - walk;
});



  });