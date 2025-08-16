    document.addEventListener("DOMContentLoaded", function () {
            // Apply the style only on this page
            let style = document.createElement("style");
            style.innerHTML = `  
  .static_page .item-post h1.entry-title {
   				font-weight: 900;
                font-size: 29px;
                line-height: 40px;
                text-align: left;
                margin: 0px;
                max-width: 1100px;
                }
  .post-inner-area {
                position: relative;
                float: left;
                width: 100%;
                overflow: hidden;
                padding: 0;
                box-sizing: border-box;
                margin: 0 0 10px;
                background: transparent;
                border: none;
  }



  @media (max-width: 768px) {

               			.static_page .item-post h1.entry-title {
   						    margin-top: 4px;
                            margin-left: 11px;
                            font-size: 20px;
                            line-height: 21px;
                             }
                          }`;
            document.head.appendChild(style);
    });
