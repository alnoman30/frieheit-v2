/* =====================================================================
   GLOBAL SETUP
   Each section is wrapped + element-guarded so a missing element on one
   page never throws and never blocks the other sections.
   ===================================================================== */

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------------------------------------------------------------------
   LENIS SMOOTH SCROLL  (single instance — used everywhere)
   --------------------------------------------------------------------- */
let lenis = null;

if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.3,
    infinite: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) { lenis.scrollTo(value, { immediate: true }); }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.body.style.transform ? 'transform' : 'fixed',
  });
}

/* small helper: run a block and never let it crash the rest of the file */
function safe(name, fn) {
  try { fn(); } catch (err) { console.warn('[' + name + '] skipped:', err.message); }
}

/* ---------------------------------------------------------------------
   NAVBAR — scrolled state
   --------------------------------------------------------------------- */
safe('navbar-scroll', function () {
  const navbar = document.getElementById('navbar');
  if (!navbar || !lenis) return;

  let tickingNav = false;
  lenis.on('scroll', ({ scroll }) => {
    if (tickingNav) return;
    tickingNav = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('navbar--scrolled', scroll > 100);
      tickingNav = false;
    });
  });
});

/* ---------------------------------------------------------------------
   MOBILE MENU
   --------------------------------------------------------------------- */
safe('mobile-menu', function () {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navbar = document.getElementById('navbar');
  if (!hamburger || !mobileMenu) return;

  const hamTop = hamburger.querySelector('.ham-top');
  const hamMid = hamburger.querySelector('.ham-mid');
  const hamBot = hamburger.querySelector('.ham-bot');
  let menuOpen = false;

  const toggleMenu = () => {
    menuOpen = !menuOpen;
    if (menuOpen) {
      mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
      navbar && navbar.classList.add('navbar--menu-open');
      if (hamTop) hamTop.style.transform = 'translateY(0px) rotate(45deg)';
      if (hamMid) { hamMid.style.opacity = '0'; hamMid.style.transform = 'scaleX(0)'; }
      if (hamBot) { hamBot.style.width = '24px'; hamBot.style.transform = 'translateY(0px) rotate(-45deg)'; }
    } else {
      mobileMenu.style.maxHeight = '0';
      navbar && navbar.classList.remove('navbar--menu-open');
      if (hamTop) hamTop.style.transform = '';
      if (hamMid) { hamMid.style.opacity = ''; hamMid.style.transform = ''; }
      if (hamBot) { hamBot.style.width = ''; hamBot.style.transform = ''; }
    }
  };

  hamburger.addEventListener('click', toggleMenu);
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => { if (menuOpen) toggleMenu(); });
  });
});

/* ---------------------------------------------------------------------
   ACTIVE NAV ITEM
   --------------------------------------------------------------------- */
safe('active-nav', function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const navItems = navbar.querySelectorAll('.nav-item');

  navItems.forEach(function (item) {
    const link = item.querySelector('a');
    if (!link) return;
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');

      // set active state
      navItems.forEach(el => el.classList.remove('active'));
      item.classList.add('active');

      // only block placeholder links ("#"); real links navigate normally
      if (!href || href === '#') {
        e.preventDefault();
      }
    });
  });
});



// text hover animation
gsap.registerPlugin(SplitText);

document.querySelectorAll(".primary-btn").forEach((btn) => {

  const text1 = new SplitText(
    btn.querySelector(".btn-text-1"),
    { type: "chars" }
  );

  const text2 = new SplitText(
    btn.querySelector(".btn-text-2"),
    { type: "chars" }
  );


  gsap.set(text2.chars, {
    yPercent: 100
  });


  btn.addEventListener("mouseenter", () => {

    gsap.to(text1.chars, {
      yPercent: -100,
      stagger: 0.03,
      duration: 0.5,
      ease: "power3.inOut"
    });

    gsap.to(text2.chars, {
      yPercent: 0,
      stagger: 0.03,
      duration: 0.5,
      ease: "power3.inOut"
    });

  });


  btn.addEventListener("mouseleave", () => {

    gsap.to(text1.chars, {
      yPercent: 0,
      stagger: 0.03,
      duration: 0.5,
      ease: "power3.inOut"
    });

    gsap.to(text2.chars, {
      yPercent: 100,
      stagger: 0.03,
      duration: 0.5,
      ease: "power3.inOut"
    });

  });

});


// review slider
document.addEventListener('DOMContentLoaded', function () {
  if (document.querySelector('#reviews-slider')) {

    new Splide('#reviews-slider', {
      type: 'loop',

      // Desktop
      perPage: 4,
      perMove: 1,
      gap: '32px',

      arrows: false,
      pagination: false,

      autoScroll: {
        speed: 1.2,
        pauseOnHover: true,
        pauseOnFocus: false,
      },

      classes: {
        arrows: 'splide__arrows reviews-arrows',
        arrow: 'splide__arrow reviews-arrow',
        prev: 'splide__arrow--prev reviews-arrow-prev',
        next: 'splide__arrow--next reviews-arrow-next',
      },

      breakpoints: {
        1199: {
          perPage: 3,
          gap: '24px',
        },

        991: {
          perPage: 2,
          gap: '20px',
          arrows: true,
        },

        640: {
          perPage: 1,
          gap: '16px',
          arrows: true,
          autoScroll: false,
        },
      },

    }).mount(window.splide.Extensions);

  }
});

// chiropractic image -parallax
gsap.utils.toArray(".parallax img").forEach(img => {

  gsap.fromTo(img,
    { y: "-10%" },
    {
      y: "10%",
      ease: "none",
      scrollTrigger: {
        trigger: img.closest(".parallax"),
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5
      }
    }
  );

});


// counter animation
document.addEventListener('DOMContentLoaded', () => {

  const counters = document.querySelectorAll('.counter');

  function formatNum(n, format) {
    return format === 'comma'
      ? n.toLocaleString()
      : n;
  }

  const observer = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const el = entry.target;

      if (el.dataset.animated === 'true') return;

      el.dataset.animated = 'true';

      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const format = el.dataset.format || '';

      const duration = 1800;
      const steps = 60;
      const increment = target / steps;
      const interval = duration / steps;

      let current = 0;

      const timer = setInterval(() => {

        current += increment;

        if (current >= target) {
          current = target;
          clearInterval(timer);
        }

        el.textContent =
          prefix +
          formatNum(Math.round(current), format) +
          suffix;

      }, interval);

      observer.unobserve(el);

    });

  }, {
    threshold: 0.5
  });

  counters.forEach(counter => {
    observer.observe(counter);
  });

});


// search filter
document.addEventListener("DOMContentLoaded", () => {


  const audioData = [

    {
      title: "Finding Inner Clarity",
      category: "free",
      language: "Yiddish",
      duration: "32 min",
      access: "Free",
      icon: "assets/images/free-play.svg"
    },

    {
      title: "Building Emotional Strength",
      category: "emotional",
      language: "Yiddish",
      duration: "36 min",
      access: "Paid",
      icon: "assets/images/paid-play.svg"
    },

    {
      title: "Understanding ADHD Mind",
      category: "adhd",
      language: "English",
      duration: "40 min",
      access: "Free",
      icon: "assets/images/free-play.svg"
    },

    {
      title: "The 12 Foundations Of Life",
      category: "foundations",
      language: "Yiddish",
      duration: "45 min",
      access: "Paid",
      icon: "assets/images/paid-play.svg"
    },

    {
      title: "Emotional Code Healing",
      category: "emotional",
      language: "English",
      duration: "38 min",
      access: "Paid",
      icon: "assets/images/paid-play.svg"
    },

    {
      title: "Parenting With Purpose",
      category: "parenting",
      language: "Yiddish",
      duration: "42 min",
      access: "Free",
      icon: "assets/images/free-play.svg"
    },

    {
      title: "Creating Shulem Bayes",
      category: "shulem",
      language: "Yiddish",
      duration: "50 min",
      access: "Paid",
      icon: "assets/images/paid-play.svg"
    },

    {
      title: "Finding Peace Within",
      category: "free",
      language: "Yiddish",
      duration: "28 min",
      access: "Free",
      icon: "assets/images/free-play.svg"
    },

    {
      title: "ADHD Emotional Balance",
      category: "adhd",
      language: "English",
      duration: "35 min",
      access: "Paid",
      icon: "assets/images/paid-play.svg"
    },

    {
      title: "Building Strong Foundations",
      category: "foundations",
      language: "Yiddish",
      duration: "55 min",
      access: "Paid",
      icon: "assets/images/paid-play.svg"
    },

    {
      title: "Marriage Emotional Connection",
      category: "emotional",
      language: "Yiddish",
      duration: "44 min",
      access: "Free",
      icon: "assets/images/free-play.svg"
    },

    {
      title: "Raising Confident Children",
      category: "parenting",
      language: "English",
      duration: "39 min",
      access: "Paid",
      icon: "assets/images/paid-play.svg"
    },

    {
      title: "Peace In The Home",
      category: "shulem",
      language: "Yiddish",
      duration: "48 min",
      access: "Free",
      icon: "assets/images/free-play.svg"
    },

    {
      title: "Personal Growth Journey",
      category: "free",
      language: "English",
      duration: "31 min",
      access: "Free",
      icon: "assets/images/free-play.svg"
    }

  ];



  const audioList = document.querySelector("#audioList");
  const pagination = document.querySelector("#pagination");
  const noResults = document.querySelector("#noResults");
  const filters = document.querySelectorAll(".filter-btn");


  let activeFilter = "all";
  let currentPage = 1;

  const perPage = 7;




  function getFilteredItems() {

    if (activeFilter === "all") {
      return audioData;
    }

    return audioData.filter(
      item => item.category === activeFilter
    );

  }




  function renderAudio() {


    const filtered = getFilteredItems();


    const totalPages = Math.ceil(
      filtered.length / perPage
    );



    if (currentPage > totalPages) {
      currentPage = 1;
    }



    const start = (currentPage - 1) * perPage;


    const items = filtered.slice(
      start,
      start + perPage
    );



    audioList.innerHTML = "";




    if (items.length === 0) {

      noResults.classList.remove("hidden");
      pagination.innerHTML = "";

      return;

    }



    noResults.classList.add("hidden");




    items.forEach(item => {


      const card = document.createElement("div");


      card.className = `
audio-card
border border-[#E3DFD8]
rounded-full
p-3 md:p-6
flex items-center justify-between
gap-4
bg-white
`;



      card.innerHTML = `

<div class="flex items-center gap-3 sm:gap-4 min-w-0">

<button class="shrink-0">
<img src="${item.icon}" alt="play">
</button>


<span class="
font-colitez
text-[#1F1B16]
text-base
sm:text-lg
md:text-xl
lg:text-2xl
truncate">

${item.title}

</span>

</div>



<div class="
flex items-center
gap-1.5
sm:gap-2
shrink-0">


<span class="
bg-[#FFF6DE]
text-[#B98400]
text-xs sm:text-sm
px-2 py-1
rounded-full">

${item.language}

</span>


<span class="
bg-[#FFF6DE]
text-[#B98400]
text-xs sm:text-sm
px-2 py-1
rounded-full">

${item.duration}

</span>


<span class="
${item.access === "Free"
          ?
          "bg-[#B98400] text-[#FFF6DE]"
          :
          "bg-[#FFF6DE] text-[#B98400]"
        }
text-xs sm:text-sm
px-2 py-1
rounded-full">

${item.access}

</span>


</div>

`;


      audioList.appendChild(card);


    });



    gsap.fromTo(
      ".audio-card",
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: 1,
        y: 0,
        duration: .45,
        stagger: .08,
        ease: "power2.out"
      }
    );



    createPagination(totalPages);


  }






  function createPagination(totalPages) {


    pagination.innerHTML = "";


    if (totalPages <= 1) {
      return;
    }



    const createButton = (html) => {

      const btn = document.createElement("button");

      btn.className = `
w-8 h-8
rounded-full
bg-[#FFF8E7]
flex
items-center
justify-center
`;

      btn.innerHTML = html;

      return btn;

    };




    // Previous

    const prev = createButton(`
<svg class="w-4 h-4"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">

<path stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M15 19l-7-7 7-7"/>

</svg>
`);


    prev.onclick = () => {

      if (currentPage > 1) {

        currentPage--;
        renderAudio();

      }

    };


    pagination.appendChild(prev);





    for (let i = 1; i <= totalPages; i++) {


      const btn = document.createElement("button");


      btn.className = `
w-8 h-8
rounded-full
flex
items-center
justify-center
text-xs
font-semibold
${i === currentPage
          ?
          "bg-[#D9A327]"
          :
          "bg-[#FFF8E7]"
        }
`;

      btn.textContent = i;



      btn.onclick = () => {

        currentPage = i;

        renderAudio();

      };



      pagination.appendChild(btn);


    }




    // Next

    const next = createButton(`
<svg class="w-4 h-4"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24">

<path stroke-linecap="round"
stroke-linejoin="round"
stroke-width="2"
d="M9 5l7 7-7 7"/>

</svg>
`);



    next.onclick = () => {

      if (currentPage < totalPages) {

        currentPage++;

        renderAudio();

      }

    };


    pagination.appendChild(next);


  }






  filters.forEach(button => {


    button.addEventListener("click", () => {


      filters.forEach(btn => {

        btn.classList.remove(
          "bg-[#DAA520]",
          "text-[#1F1B16]"
        );

        btn.classList.add(
          "bg-[#1F1B16]",
          "text-white"
        );

      });



      button.classList.remove(
        "bg-[#1F1B16]",
        "text-white"
      );


      button.classList.add(
        "bg-[#DAA520]",
        "text-[#1F1B16]"
      );



      activeFilter = button.dataset.filter;


      currentPage = 1;


      renderAudio();


    });


  });



  renderAudio();


});