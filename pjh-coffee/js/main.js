const searchEl = document.querySelector(".search");
const searchInputEl = searchEl.querySelector("input");
searchEl.addEventListener("click", function () {
  searchInputEl.focus();
});
searchInputEl.addEventListener("focus", function () {
  searchEl.classList.add("focused");
  searchInputEl.setAttribute("placeholder", "통합검색");
});
searchInputEl.addEventListener("blur", function () {
  searchEl.classList.remove("focused");
  searchInputEl.setAttribute("placeholder", "");
});

// 페이지 스크롤에 따른 요소 제어
// badge = 우측 팝업 광고
const badgeEl = document.querySelector("header .badges");
const toTopEl = document.querySelector("#to-top");

const debounce = function (func, wait) {
  let timeoutId;
  return function () {
    // this.self = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, wait);
  };
};

window.addEventListener(
  "scroll",
  debounce(function () {
    console.log(window.scrollY);
    if (window.scrollY > 500) {
      // 배지 숨기기
      setVisible(badgeEl, false);
      // 상단으로 이동 버튼 보이기
      setVisible(toTopEl, true, 0);
    } else {
      // 배지 보이기
      setVisible(badgeEl, true);
      setVisible(toTopEl, false, 100);
    }
  }, 500)
);

const runMainBannerAinmation = () => {
  /**
   * 순서대로 나타나는 기능
   */
  // 나타날 요소(.fade-in)들을 찾기
  const fadeIn = (el, duration, i, baseDelay = 0.7) => {
    // 초기 opacity를 0으로 설정하고 바로 1로 변경하기 전에 브라우저에 '기회'를 줍니다.
    el.style.opacity = 0;

    // 비동기적으로 transition을 설정하여 브라우저가 초기 opacity 값을 처리할 시간을 줍니다.
    setTimeout(() => {
      el.style.transition = `all ${duration}s ease-out ${(i + 1) * baseDelay}s`;
      el.style.opacity = 1;
    }, 10); // 10ms의 지연은 대부분의 경우 충분합니다.
  };

  const fadeEls = document.querySelectorAll(".visual .fade-in");
  fadeEls.forEach(function (fadeEl, i) {
    fadeIn(fadeEl, 1, i);
    // gsap.to(fadeEl, 1, {delay: (i + 1) * 0.7, opacity: 1});
  });
};
runMainBannerAinmation();

new Swiper(".notice .swiper", {
  direction: "vertical",
  autoplay: true,
  loop: true,
});

new Swiper(".promotion .swiper", {
  // direction: 'horizontal', // 수평 슬라이드
  autoplay: {
    // 자동 재생 여부
    delay: 5000, // 5초마다 슬라이드 바뀜
  },
  loop: true, // 반복 재생 여부
  slidesPerView: 3, // 한 번에 보여줄 슬라이드 개수
  spaceBetween: 10, // 슬라이드 사이 여백
  centeredSlides: true, // 1번 슬라이드가 가운데 보이기
  pagination: {
    // 페이지 번호 사용
    el: ".promotion .swiper-pagination", // 페이지 번호 요소
    clickable: true, // 사용자의 페이지 번호 제어 여부
  },
  navigation: {
    // 슬라이드 이전/다음 버튼 사용
    prevEl: ".promotion .swiper-button-prev", // 이전 버튼 요소
    nextEl: ".promotion .swiper-button-next", // 다음 버튼 요소
  },
});

const promotionEl = document.querySelector("section.promotion");
const promotionToggleBtn = document.querySelector(".toggle-promotion");
promotionToggleBtn.addEventListener("click", function () {
  if (promotionEl.classList.contains("hide")) {
    promotionEl.classList.remove("hide");
  } else {
    promotionEl.classList.add("hide");
  }
});

/**
 * 부유하는 요소 관리
 */
/** ! Javascript로 애니메이션 하는 4가지 방식
 * 1. CSS Animation과 동일 방식 => 이 방식을 사용할 바에는 CSS로 하는게 더 나을 듯.
 * 2. requestAnimationFrame() 사용 => 뭔가 구현이 복잡하고 구현이 세밀하게 하기 어려운 듯.
 * 3. Web Animation API (el.animate()) 사용 => 순수 JS로 애니메이션을 구현할 때 가장 깔끔하고 쉬운 방법같아 보임.
 * 4. gsap.to() 사용 (GSAP 라이브러리는 외부 라이브러리임.)
 */
const float1 = document.querySelector(".floating1");
const float2 = document.querySelector(".floating2");
const float3 = document.querySelector(".floating3");

// 1. css 이용 방식
function animateVerticalMovement(element, animationDuration, options) {
  const { animationDistanceY, infinite, delay, alternate, ease } = options; // Distance in pixels

  element.style.animation = `floatAnimation ${animationDuration}s ${infinite} ${delay}s ${alternate}`;
  element.style.animationTimingFunction = ease;

  // Define the keyframes for the animation
  const keyframes = `
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(${animationDistanceY}px);
    }
  `;

  // Create a style element and append the keyframes
  const style = document.createElement("style");
  style.innerHTML = `@keyframes floatAnimation { ${keyframes} }`;

  // Append the style element to the document head
  document.head.appendChild(style);
}
animateVerticalMovement(float1, 1.5, {
  delay: 1,
  animationDistanceY: 15,
  infinite: "infinite",
  alternate: "alternate",
  ease: "ease-in-out",
});

// 2. requestAnimationFrame() 사용 방식
// var startPosition = 0; // 시작 위치. 필요에 따라 조정할 수 있습니다.
// var position = startPosition; // 현재 위치
// var direction = 1; // 움직임의 방향 (1: 아래로, -1: 위로)
// var range = 15; // 움직임의 최대 범위 (픽셀 단위)
// var movingDown = true; // 현재 아래로 움직이는 중인지를 나타냄
// var animationDuration = 2000;
// var startTime = Date.now(); // 애니메이션 시작 시간

// function moveElement() {
//   var elapsedTime = Date.now() - startTime; // 경과 시간
//   var fractionOfAnimation = elapsedTime / animationDuration; // 애니메이션 진행 비율

//   // 현재 아래로 움직이는 경우
//   if (movingDown) {
//     position += range * fractionOfAnimation; // 위치를 업데이트하여 아래로 이동
//     if (position >= startPosition + range) {
//       // 최대 범위에 도달하면
//       movingDown = false; // 방향 전환을 위해 상태 변경
//       startTime = Date.now(); // 애니메이션 시작 시간을 다시 설정
//     }
//   } else {
//     position -= range * fractionOfAnimation; // 위치를 업데이트하여 위로 이동
//     if (position <= startPosition) {
//       // 원위치에 도달하면
//       movingDown = true; // 다시 아래로 움직임 시작
//       startTime = Date.now(); // 애니메이션 시작 시간을 다시 설정
//     }
//   }

//   float2.style.transform = `translateY(${position}px)`; // 요소의 위치 적용

//   // 다음 애니메이션 프레임을 위해 moveElement 함수를 다시 호출
//   requestAnimationFrame(moveElement);
// }
// requestAnimationFrame(moveElement);

// 1번 css 이용 방식과 비교용
// animateVerticalMovement(float2, 2, {
//   delay: 0.5,
//   animationDistanceY: 15,
//   infinite: "infinite",
//   alternate: "alternate",
//   ease: "ease-in-out",
// });

// 3. Web Animation API (el.animate()) 사용 방식
float2.animate([{ transform: `translateY(${15}px)` }], {
  duration: 2000,
  delay: 500,
  iterations: Infinity,
  direction: "alternate",
  easing: "ease-in-out",
});

// 4. gsap.to() 사용 방법 예시
// gsap.to(".floating3", 2.5, {
//   delay: 1.5,
//   y: 20,
//   repeat: -1,
//   yoyo: true,
//   ease: Power1.easeInOut,
// });

animateVerticalMovement(float3, 2.5, {
  delay: 1.5,
  animationDistanceY: 20,
  infinite: "infinite",
  alternate: "alternate",
  ease: "ease-in-out",
});

/** ! 스크롤 위치에 따른 애니메이션 [[ */
// ScrolMagic 라이브러리 사용
const spyEls = document.querySelectorAll("section.scroll-spy");
spyEls.forEach(function (spyEl) {
  new ScrollMagic.Scene({
    // 감시할 장면(Scene)을 추가
    triggerElement: spyEl, // 보여짐 여부를 감시할 요소를 지정
    triggerHook: 0.8, // 뷰포트의 80% 지점에서 보여짐 여부 감시
  })
    .setClassToggle(spyEl, "show")
    .addTo(new ScrollMagic.Controller());
});
// 어떤 요소가 화면에 보이는지 감시하는 IntersectionObserver API 사용하여 ScrollMagic 라이브러리 대체하기
// ** ]] 스크롤 애니메이션 */
// Swiper.js도 vanilla JS로 대체하기

/* Awards */
new Swiper(".awards .swiper", {
  autoplay: true,
  loop: true,
  spaceBetween: 30,
  slidesPerView: 5,
  navigation: {
    prevEl: ".awards .swiper-button-prev",
    nextEl: ".awards .swiper-button-next",
  },
});

// CopyRight Year
const thisYear = document.querySelector(".this-year");
thisYear.textContent = new Date().getFullYear();

/** 페이지 최상단으로 이동 구현 */
// 사용자가 스크롤을 할 때마다 버튼의 표시 여부를 결정하는 함수
/** 웹 엘리먼트를 사라지게 하는 함수 = gsap.to() 대체용
 * gsap.to(요소, 지속시간, 옵션); 코드를 대체하도록 Vanilla JS로 구현
 * gsap.to(badgeEl, 0.6, {opacity: 0, display: "none"}); => setVisible(badgeEl, false);로 대체
 * gsap.to(badgeEl, 0.6, {opacity: 1, display: "block"}); => setVisible(badgeEl, true);로 대체
 */
const setVisible = (el, visible, translateXCoord = 0) => {
  el.style.visibility = visible ? "visible" : "hidden";
  el.style.opacity = visible ? 1 : 0;
  el.style.transform = `translateX(${translateXCoord}px)`; // 0px

  // setTimeout(function () { // 스크롤시 말고 hover시 사라지게 할때 특정시간 후에 사라자게 해야 깜빡인 혆상이 안나타날때가 있다.
  //   badgeEl.style.visibility = "hidden";
  // }, 500);
};

toTopEl.addEventListener("click", function () {
  // 페이지 최상단으로 부드럽게 스크롤
  window.scrollTo({ top: 0, behavior: "smooth" });
});
