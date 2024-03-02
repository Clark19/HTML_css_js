# pjh-coffee : Heropy Coffee 클론 실습한 내용
 * 'Hello IT 프론트엔드 개발을 시작하려고 해, 입문편, (박영웅 저)'에 수록. 패캠 국비지원 'React_Redux로 시작하는 웹 프로그래밍' 인강에도 있는 내용.
 * 원본 저장소 - https://github.com/ParkYoungWoong/heropy-coffee

## 원본 강의 내용과 다르게 내가 변경했거나, 주목할 만한 내용.
### * 웹 엘리먼트를 사라지게 하는 함수 구현 - GASP.to() 대체
 - gsap.to(요소, 지속시간, 옵션)라는 함수를 대체하도록 Vanilla JS로 다음과 같이 구현
```js
/* gsap.to(badgeEl, 0.6, {opacity: 0, display: "none"}); => setVisible(badgeEl, false);로 대체
 * gsap.to(badgeEl, 0.6, {opacity: 1, display: "block"}); => setVisible(badgeEl, true);로 대체
 */
const setVisible = (el, visible, tranformXCoord = 0) => {
  el.style.visibility = visible ? "visible" : "hidden";
  el.style.opacity = visible ? 1 : 0;
  el.style.transform = `translateX(${tranformXCoord}px)`; // 0px

  // setTimeout(function () { // 스크롤시 말고 hover시 사라지게 할때 특정시간 후에 사라자게 해야 깜빡인 혆상이 안나타날때가 있다.
  //   badgeEl.style.visibility = "hidden";
  // }, 500);
};
```

### * 페이드인 효과 애니메이션 함수 구현
 - gsap.to(fadeEl, 1, {delay: (i + 1) * 0.7, opacity: 1}); 함수 대체용
 - Vanilla JS로 구현
```js
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
```

### * 둥둥 떠 다니는 효과 Vanilla JS로 구현
 - gsap.to(".floating3", 2.5, {delay: 1.5, y: 20, repeat: -1, yoyo: true, ease: Power1.easeInOut}); 대체 <br>
#### * Javascript로 애니메이션 하는 4가지 방식
 * 1. CSS Animation과 동일 방식 => 이 방식을 사용할 바에는 CSS로 하는게 더 나을 듯.
 * 2. requestAnimationFrame() 사용 => 뭔가 구현이 복잡하고 구현이 세밀하게 하기 어려운 듯.
 * 3. Web Animation API (el.animate()) 사용 => 순수 JS로 애니메이션을 구현할 때 가장 깔끔하고 쉬운 방법같아 보임.
 * 4. gsap.to() 사용 (GSAP 라이브러리는 외부 라이브러리임.)
 ```js
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
// float2 Elemet를 requestAnimationFrame() 사용하여 애니메이션 하는 방법
var startPosition = 0; // 시작 위치. 필요에 따라 조정할 수 있습니다.
var position = startPosition; // 현재 위치
var direction = 1; // 움직임의 방향 (1: 아래로, -1: 위로)
var range = 15; // 움직임의 최대 범위 (픽셀 단위)
var movingDown = true; // 현재 아래로 움직이는 중인지를 나타냄
var animationDuration = 2000;
var startTime = Date.now(); // 애니메이션 시작 시간

function moveElement() {
  var elapsedTime = Date.now() - startTime; // 경과 시간
  var fractionOfAnimation = elapsedTime / animationDuration; // 애니메이션 진행 비율

  // 현재 아래로 움직이는 경우
  if (movingDown) {
    position += range * fractionOfAnimation; // 위치를 업데이트하여 아래로 이동
    if (position >= startPosition + range) {
      // 최대 범위에 도달하면
      movingDown = false; // 방향 전환을 위해 상태 변경
      startTime = Date.now(); // 애니메이션 시작 시간을 다시 설정
    }
  } else {
    position -= range * fractionOfAnimation; // 위치를 업데이트하여 위로 이동
    if (position <= startPosition) {
      // 원위치에 도달하면
      movingDown = true; // 다시 아래로 움직임 시작
      startTime = Date.now(); // 애니메이션 시작 시간을 다시 설정
    }
  }

  float2.style.transform = `translateY(${position}px)`; // 요소의 위치 적용

  // 다음 애니메이션 프레임을 위해 moveElement 함수를 다시 호출
  requestAnimationFrame(moveElement);
}
requestAnimationFrame(moveElement);



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
gsap.to(".floating3", 2.5, {
  delay: 1.5,
  y: 20,
  repeat: -1,
  yoyo: true,
  ease: Power1.easeInOut,
});

 ```


### 스크롤 위치에 따른 애니메이션 구현시 GSAP와 ScrollToPlugin.js(GSAP의 플러그인)을 이용하여 구현한 것을 대체
 * 페이지 최상단 이동시 사용한 gsap.to(window, .6, {scrollTo: 0}) 라는 코드를 window.scrollTo({top:0, behavior: "smooth"})로 수정
 * ScrollMagic 라이브러리 이용하던 부분 vanilla JS로 수정 할 것!
  - 즉, 어떤 요소가 화면에 보이는지 감시하는 기능을 IntersectionObserver API 사용하여 ScrollMagic 라이브러리를 대체하기
```js
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
```

### Swiper.js도 대체 용이한지 체크해 볼 것.

#### HTML 특수문자(HTML Character Entities)는 특정 글자를 대신 표시하는 데 사용됩니다. 표기는 &copy;와 같이 엠퍼센드(&) 기호로 시작해서 세미콜론(;) 기호로 종료합니다.
\<div\>라는 글자를 출력하려면 \&lt;div\&gt;라고 작성해야 함.
 * 자주 사용되는 HTML 특수문자

| HTML 특수문자 |   출력  |     약어     |     설명    |
|:-----------:|:-------------:|:------:|:------:|
| \&lt; | < | Less Than   |    |
| \&gt; | > |  Greater Than  |   |
| \&nbsp; |   | Non Breaking SPace | 줄바꿈 없는 공백(띄어쓰기) |
| \&copy; | &copy; | COPYright    |   |
더 많은 html 특수문자는 https://dev.w3.org/html5/html-author/charref


#### 그 밖의 내용
 * git config --global --list : 깃의 전역 환경 정보 보기
 * git commit 시 자동 개행 변경 설정 바꾸기: Mac- git config --global core.autocrlf input  ,  Win - git config --global core.autocrlf true
 * 이미 추적중인 파일을 버전 관리 목록에서 제거하기: `gitr rm -r --cached <file/folder>`
 * git branch명 변경법: `git branch -M main` : 현재 브랜치를 'main'이란 명칭으로 변경 
 * Mac일 경우 q를 눌러줘야 정보 보기 화면에서 빠져나옴.
 * 터미널 화면 정리: Win- cls 입력, Mac- Ctrl+K 입력
