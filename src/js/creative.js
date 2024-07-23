(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (
      location.pathname.replace(/^\//, "") ==
        this.pathname.replace(/^\//, "") &&
      location.hostname == this.hostname
    ) {
      var target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        $("html, body").animate(
          {
            scrollTop: target.offset().top - 56
          },
          1000,
          "easeInOutExpo"
        );
        return false;
      }
    }
  });

  // Closes responsive menu when a scroll trigger link is clicked
  $(".js-scroll-trigger").click(function() {
    $(".navbar-collapse").collapse("hide");
  });

  // Activate scrollspy to add active class to navbar items on scroll
  // $("body").scrollspy({
  //   target: "#mainNav",
  //   offset: 57
  // });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);

  // Scroll reveal calls
  window.sr = ScrollReveal();
  sr.reveal(
    ".sr-icons",
    {
      duration: 600,
      scale: 0.3,
      distance: "0px"
    },
    200
  );
  sr.reveal(".sr-button", {
    duration: 1000,
    delay: 200
  });
  sr.reveal(
    ".sr-contact",
    {
      duration: 600,
      scale: 0.3,
      distance: "0px"
    },
    300
  );

  // Magnific popup calls
  $(".popup-gallery").magnificPopup({
    delegate: "a",
    type: "image",
    tLoading: "Loading image #%curr%...",
    mainClass: "mfp-img-mobile",
    gallery: {
      enabled: true,
      navigateByImgClick: true,
      preload: [0, 1]
    },
    image: {
      tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
    }
  });
})(jQuery); // End of use strict
$(document).ready(function() {
  var x = window.matchMedia("(max-width: 575px)");
  var window_height = $(window).height();

  $(window).scroll(function() {
    if (x.matches) {
      var scrollMiddle = $(window).scrollTop() + window_height / 2;
      $("div.portfolio-box-caption").each(function() {
        elTop = $(this).offset().top;
        elBtm = elTop + $(this).height();
        if (elTop < scrollMiddle && elBtm > scrollMiddle) {
          $(this).css("opacity", 1);
        } else {
          $(this).css("opacity", 0);
        }
      });

      $("li.timeline-event").each(function() {
        elTop = $(this).offset().top;
        elBtm = elTop + $(this).height();
        if (elTop < scrollMiddle && elBtm > scrollMiddle) {
          $(this)
            .children(".timeline-event-icon")
            .css({
              "-moz-transform": "rotate(-45deg)",
              "-ms-transform": "rotate(-45deg)",
              "-webkit-transform": "rotate(-45deg)",
              transform: "rotate(-45deg)",
              "background-color": "#a83279"
            });

          $(this)
            .find("div > p.timeline-event-thumbnail")
            .css({
              "-moz-box-shadow": "inset 40em 0 0 0 #a83279",
              "-webkit-box-shadow": "inset 40em 0 0 0 #a83279",
              "box-shadow": "inset 40em 0 0 0 #a83279"
            });
        } else {
          $(this)
            .children(".timeline-event-icon")
            .css({
              "-moz-transform": "",
              "-ms-transform": "",
              "-webkit-transform": "",
              transform: "",
              "background-color": ""
            });

          $(this)
            .find("div > p.timeline-event-thumbnail")
            .css({
              "-moz-box-shadow": "",
              "-webkit-box-shadow": "",
              "box-shadow": ""
            });
        }
      });
    } else {
      $("div.portfolio-box-caption").each(function() {
        $(this).css("opacity", "");
      });
      $("li.timeline-event").each(function() {
        $(this)
          .children(".timeline-event-icon")
          .css({
            "-moz-transform": "",
            "-ms-transform": "",
            "-webkit-transform": "",
            transform: "",
            "background-color": ""
          });

        $(this)
          .find("div > p.timeline-event-thumbnail")
          .css({
            "-moz-box-shadow": "",
            "-webkit-box-shadow": "",
            "box-shadow": ""
          });
      });
    }
  });
});
