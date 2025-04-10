(function(){
  "use strict";
  function a(a){document.readyState!=="loading"?a():document.addEventListener("DOMContentLoaded",a)}
  function b(a){return document.querySelector(a)}
  function c(a){return document.querySelectorAll(a)}

  a(function(){
    const d=b(".hamburger"),
          e=b(".nav-links"),
          f=b(".navbar");

    if(d){
      d.addEventListener("click",()=>{
        e.classList.toggle("active");
        d.classList.toggle("active")
      });
      document.addEventListener("click",a=>{
        if(d&&!d.contains(a.target)&&e&&!e.contains(a.target)){
          e.classList.remove("active");
          d.classList.remove("active")
        }
      });
      c(".nav-links a").forEach(a=>{
        a.addEventListener("click",()=>{
          e.classList.remove("active");
          d.classList.remove("active")
        })
      })
    }

    c('a[href^="#"]').forEach(a=>{
      a.addEventListener("click",function(c){
        c.preventDefault();
        const f=this.getAttribute("href");
        if(f==="#") return;
        const g=b(f);
        if(g){
          if(e) e.classList.remove("active");
          if(d) d.classList.remove("active");
          g.scrollIntoView({behavior:"smooth",block:"start"})
        }
      })
    });

    if(f){
      let a=0;
      window.addEventListener("scroll",()=>{
        const b=window.pageYOffset;
        if(b<=0){
          f.classList.remove("scroll-up");
          return
        }
        if(b>a&&!f.classList.contains("scroll-down")){
          f.classList.remove("scroll-up");
          f.classList.add("scroll-down")
        } else if(b<a&&f.classList.contains("scroll-down")){
          f.classList.remove("scroll-down");
          f.classList.add("scroll-up")
        }
        a=b
      })
    }

    const g=c(".faq-item");
    g.forEach(a=>{
      const b=a.querySelector(".faq-question");
      if(b){
        b.addEventListener("click",()=>{
          g.forEach(b=>{
            if(b!==a){
              b.classList.remove("active")
            }
          });
          a.classList.toggle("active")
        })
      }
    });

    c(".internship-card .apply-btn").forEach(a=>{
      a.addEventListener("click",function(){
        const b=this.closest(".internship-card").querySelector("h3").textContent;
        alert(`Thank you for your interest in the ${b}! Application form will be available soon.`)
      })
    });

    const h=b("#learnMoreBtn"),
          i=b("#learnMoreModal"),
          j=b(".close-modal");

    if(h&&i){
      h.addEventListener("click",a=>{
        a.preventDefault();
        i.style.display="block";
        document.body.style.overflow="hidden"
      });
      if(j){
        j.addEventListener("click",()=>{
          i.style.display="none";
          document.body.style.overflow="auto"
        })
      }
      window.addEventListener("click",a=>{
        if(a.target===i){
          i.style.display="none";
          document.body.style.overflow="auto"
        }
      })
    }

    if(document.body.classList.contains("career-page")||b(".career-hero")){
      c(".position-card .apply-btn:not([disabled])").forEach(a=>{
        a.addEventListener("click",function(){
          const b=this.closest(".position-card").querySelector("h3").textContent;
          this.closest(".position-card").querySelector(".position-details li:first-child").textContent;
          const c=document.createElement("div");
          c.className="modal application-modal";
          c.innerHTML=`
<div class="modal-content">
  <span class="close-modal">&times;</span>
  <h2>Apply for ${b}</h2>
  <div class="application-message">
    <p>Thank you for your interest in the ${b} position!</p>
    <p>We are currently reviewing applications. Please send your resume to <strong>careers@internpedia.com</strong> with the position title in the subject line.</p>
    <div class="confirmation-btns">
      <button class="submit-btn">Understood</button>
    </div>
  </div>
</div>
`;
          document.body.appendChild(c);
          c.style.display="block";
          document.body.style.overflow="hidden";
          const d=c.querySelector(".close-modal");
          d.addEventListener("click",()=>{
            c.style.display="none";
            document.body.style.overflow="auto";
            c.remove()
          });
          c.addEventListener("click",a=>{
            if(a.target===c){
              c.style.display="none";
              document.body.style.overflow="auto";
              c.remove()
            }
          });
          const e=c.querySelector(".submit-btn");
          e.addEventListener("click",a=>{
            a.preventDefault();
            c.style.display="none";
            document.body.style.overflow="auto";
            c.remove()
          })
        })
      })
    }

    const f=c(".benefit-card");
    const g=new IntersectionObserver(a=>{
      a.forEach(a=>{
        if(a.isIntersecting){
          a.target.style.opacity="1";
          a.target.style.transform="translateY(0)"
        }
      })
    },{threshold:0.1});
    f.forEach(a=>{
      a.style.opacity="0";
      a.style.transform="translateY(20px)";
      a.style.transition="all 0.6s ease-out";
      g.observe(a)
    });

    const k=b("#newsletter-form");
    if(k){
      k.addEventListener("submit",a=>{
        a.preventDefault();
        const b=k.querySelector('input[type="email"]').value;
        alert(`Thank you for subscribing to our newsletter with ${b}!`);
        k.reset()
      })
    }
  });
})();
