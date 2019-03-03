window.onload = function() { // after page loaded

    var scrollUp = document.getElementById('scrollup');

    scrollUp.onmouseover = function() { // add transparency
        scrollUp.style.opacity=0.3;
        scrollUp.style.filter  = 'alpha(opacity=30)';
    };

    scrollUp.onmouseout = function() {
        scrollUp.style.opacity = 0.5;
        scrollUp.style.filter  = 'alpha(opacity=50)';
    };

    scrollUp.onclick = function() {
        window.scrollTo(0,0);
    };

// show button

    window.onscroll = function () {
        if ( window.pageYOffset > 0 ) {
            scrollUp.style.display = 'block';
        } else {
            scrollUp.style.display = 'none';
        }
    };
};
