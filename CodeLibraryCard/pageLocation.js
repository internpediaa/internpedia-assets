document.addEventListener("DOMContentLoaded", function () {
          if (window.location.pathname === "/p/html-css-javascript.html" || window.location.pathname === "/p/tools.html") {
              // Apply the style only on this page
              let style = document.createElement("style");
              style.innerHTML = `
              .container {
      position: relative !important;
      max-width: 100% !important;
      width: 1145px !important;
  }

  .static_page .item-post h1.entry-title {
  	display: none;
  }

  .post-body h3 {
  	color: #000000 !important;
  }

  .dark .post-body p {
      color: #0d0d0de6 !important;
  }

              .post-inner-area {
              	background: none;
    				border: none;
    				border-radius: 0;
                	padding: 0;
                  `;
              document.head.appendChild(style);
          }
      });
