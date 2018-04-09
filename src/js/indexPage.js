var mySwiper = new Swiper('.swiper-container', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,
  slidesPerView: 'auto',
  spaceBetween: 15,
  // If we need pagination
  // pagination: {
  //   el: '.swiper-pagination',
  // },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

$(document).ready(function() {
  equalheight('.roast-time');
  equalheight('.roast-acidity');
  equalheight('.roast-aroma');
});
$(window).load(function() {
  equalheight('.roast-time');
  equalheight('.roast-acidity');
  equalheight('.roast-aroma');
});
$(window).resize(function() {
  equalheight('.roast-time');
  equalheight('.roast-acidity');
  equalheight('.roast-aroma');
});