/* Thanks to CSS Tricks for pointing out this bit of jQuery
https://css-tricks.com/equal-height-blocks-in-rows/
It's been modified into a function called at page load and then each time the page is resized. One large modification was to remove the set height before each new calculation. */

equalheight = function(container) {

  var currentTallest = 0,
    currentRowStart = 0,
    rowDivs = new Array(),
    $el,
    topPosition = 0;
  $(container).each(function() {

    $el = $(this);
    $($el).height('auto')
    topPostion = $el.position().top;

    if (currentRowStart != topPostion) {
      for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
        rowDivs[currentDiv].height(currentTallest);
      }
      rowDivs.length = 0; // empty the array
      currentRowStart = topPostion;
      currentTallest = $el.height();
      rowDivs.push($el);
    } else {
      rowDivs.push($el);
      currentTallest = (currentTallest < $el.height()) ? ($el.height()) : (currentTallest);
    }
    for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
      rowDivs[currentDiv].height(currentTallest);
    }
  });
}

$(".invite-link").click(function(e) {
e.preventDefault();
    var offset = -70;
    $('html, body').animate({
        scrollTop: $("#join-invite").offset().top + offset
    }, 1000);
});

function checkHeader() {
  // console.log($(window).scrollTop())
  if ($(window).scrollTop() > 200) {
    $('.header').addClass('float-header');
  } else {
    $('.header').removeClass('float-header');
  }
}

$(document).ready(function() {
  checkHeader();
});
$(window).scroll(function() {
  checkHeader();
});