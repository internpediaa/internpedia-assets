<script>
    document.addEventListener("DOMContentLoaded", function () {
            // Apply the style only on this page
            let style = document.createElement("style");
            style.innerHTML = `  
  .static_page .item-post h1.entry-title {
   				font-weight: 900;
    			font-size: 42px;
    			line-height: 52px;
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
        						font-size: 22px;
        						line-height: 15px;
                             }
                          }`;
            document.head.appendChild(style);
    });
</script>
