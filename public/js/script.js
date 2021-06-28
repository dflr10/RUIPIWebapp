$(function () {
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse("hide");
    }
  });
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {
  var ruipi = {};

  const homeHtml = "snipets/homesnipet.html",
    donateHtml = "snipets/donatesnipet.html",
    contactHtml = "snipets/contactsnipet.html",
    blogHtml = "snipets/blogsnipet.html",
    aboutHtml = "snipets/aboutsnipet.html";

  const selector = "li";

  //Active li menu
  $(selector).on("click", function () {
    $(selector).removeClass("active");
    $(this).addClass("active");
  });

  // Convenience function for inserting innerHTML for 'select'
  const insertHtml = function (selector, html) {
    let targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  // Show loading icon inside element identified by 'selector'.
  const showLoading = function (selector) {
    let html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {
    // On first load, show home view
    showLoading("main");
    $ajaxUtils.sendGetRequest(
      homeHtml,
      function (responseText) {
        document.querySelector("main").innerHTML = responseText;
      },
      false
    );

    //Load the home view
    ruipi.loadHome = function () {
      showLoading("main");
      $ajaxUtils.sendGetRequest(
        homeHtml,
        function (responseText) {
          document.querySelector("main").innerHTML = responseText;
        },
        false
      );
    };

    // Load the contact view
    ruipi.loadContact = function () {
      showLoading("main");
      $ajaxUtils.sendGetRequest(
        contactHtml,
        function (responseText) {
          document.querySelector("main").innerHTML = responseText;
          contactValidations();
        },
        false
      );
    };
    // Load the donate view
    ruipi.loadDonate = function () {
      showLoading("main");
      $ajaxUtils.sendGetRequest(
        donateHtml,
        function (responseText) {
          document.querySelector("main").innerHTML = responseText;
        },
        false
      );
    };
    // Load the blog view
    ruipi.loadBlog = function () {
      showLoading("main");
      $ajaxUtils.sendGetRequest(
        blogHtml,
        function (responseText) {
          document.querySelector("main").innerHTML = responseText;
        },
        false
      );

      //coments box
      (function () {
        // DON'T EDIT BELOW THIS LINE
        var d = document,
          s = d.createElement("script");
        s.src = "https://ruipi-enterprice.disqus.com/embed.js";
        s.setAttribute("data-timestamp", +new Date());
        (d.head || d.body).appendChild(s);
      })();
    };
    // Load the about view
    ruipi.loadAbout = function () {
      showLoading("main");
      $ajaxUtils.sendGetRequest(
        aboutHtml,
        function (responseText) {
          document.querySelector("main").innerHTML = responseText;
        },
        false
      );
    };
    const $home = document.getElementById("navHomeButton");
    $home.classList.add("active");
  });

  global.$ruipi = ruipi;
})(window);

const d = document;

function contactValidations() {
  let $form = document.querySelector(".contact-form"),
    $inputs = d.querySelectorAll(".contact-form [required]");

  $inputs.forEach((input) => {
    const $span = d.createElement("span");
    $span.id = input.name;
    $span.textContent = input.title;
    $span.classList.add("contact-form-error", "none");
    input.insertAdjacentElement("afterend", $span);
  });

  d.addEventListener("keyup", (e) => {
    if (e.target.matches(".contact-form [required]")) {
      let $input = e.target,
        pattern = $input.pattern || $input.dataset.pattern;
      if (pattern && $input.value !== "") {
        let regex = new RegExp(pattern);
        return !regex.exec($input.value)
          ? d.getElementById($input.name).classList.add("is-active")
          : d.getElementById($input.name).classList.remove("is-active");
      }
      if (!pattern) {
        return $input.value == ""
          ? d.getElementById($input.name).classList.add("is-active")
          : d.getElementById($input.name).classList.remove("is-active");
      }
    }
  });

  d.addEventListener("submit", (e) => {
    e.preventDefault();

    const $loader = d.querySelector(".contact-form-loader"),
      $response = d.querySelector(".contact-form-response");

    $loader.classList.remove("none");

    fetch("https://formsubmit.co/ajax/felipe_lozada04102@elpoli.edu.co", {
      method: "POST",
      body: new FormData(e.target),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        //console.log(json);
        $loader.classList.add("none");
        $response.classList.remove("none");
        $response.innerHTML = `<p>${json.message}</p>`;
        $form.reset();
      })
      .catch((err) => {
        console.log(err);
        let message = err.statusText || "Ocurrió un ERROR";
        $response.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
      })
      .finally(() =>
        setTimeout(() => {
          $response.classList.add("none");
          $response.innerHTML = "";
        }, 2000)
      );
  });
}

d.addEventListener("click", (e) => {
  //Set or remove current section class active
  if (e.target.matches("li")) {
    $("li").removeClass("active");
  }

  if (e.target.matches(".link")) {
    $("li").removeClass("active");
  }

  if (e.target.matches(".link-contact")) {
    d.getElementById("navContactButton").classList.add("active");
  }
  if (e.target.matches(".link-about")) {
    d.getElementById("navAboutButton").classList.add("active");
  }
  if (e.target.matches(".link-blog")) {
    d.getElementById("navBlogButton").classList.add("active");
  }
});
