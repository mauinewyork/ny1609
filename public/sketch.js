document.addEventListener('DOMContentLoaded', () => {
  const desktopSlideImageElement = document.getElementById('slide-image');
  const mobileSlidesContainer = document.getElementById('mobile-slides-container');

  const slideImagePaths = [
    "nachtcultuur-slides/slide-01.png",
    "nachtcultuur-slides/slide-02.png",
    "nachtcultuur-slides/slide-03.png",
    "nachtcultuur-slides/slide-04.png",
    "nachtcultuur-slides/slide-05.png",
    "nachtcultuur-slides/slide-06.png",
    "nachtcultuur-slides/slide-07.png",
    "nachtcultuur-slides/slide-08.png",
    "nachtcultuur-slides/slide-09.png",
    "nachtcultuur-slides/slide-10.png",
    "nachtcultuur-slides/slide-11.png",
    "nachtcultuur-slides/slide-12.png",
    "nachtcultuur-slides/slide-13.png",
    "nachtcultuur-slides/slide-14.png",
    "nachtcultuur-slides/slide-15.png",
    "nachtcultuur-slides/slide-16.png",
    "nachtcultuur-slides/slide-17.png",
    "nachtcultuur-slides/slide-18.png",
    "nachtcultuur-slides/slide-19.png",
    "nachtcultuur-slides/slide-20.png",
    "nachtcultuur-slides/slide-21.png",
    "nachtcultuur-slides/slide-22.png",
    "nachtcultuur-slides/slide-23.png",
    "nachtcultuur-slides/slide-24.png",
    "nachtcultuur-slides/slide-25.png",
    "nachtcultuur-slides/slide-26.png",
    "nachtcultuur-slides/slide-27.png",
    "nachtcultuur-slides/slide-28.png",
    "nachtcultuur-slides/slide-29.png",
    "nachtcultuur-slides/slide-30.png",
    "nachtcultuur-slides/slide-31.png",
    "nachtcultuur-slides/slide-32.png",
    "nachtcultuur-slides/slide-33.png",
    "nachtcultuur-slides/slide-34.png",
    "nachtcultuur-slides/slide-35.png",
    "nachtcultuur-slides/slide-36.png"
  ];

  const actualNumSlides = slideImagePaths.length;
  let currentDesktopSlide = 0;
  let preloadedDesktopImage = null;

  function isMobileView() {
    return window.innerWidth <= 768;
  }

  function setupMobileView() {
    if (!mobileSlidesContainer) {
      console.error("Mobile slides container not found.");
      return;
    }
    mobileSlidesContainer.innerHTML = ''; // Clear any previous content

    function loadMobileSlideAtIndex(index) {
      if (index >= actualNumSlides) {
        // All slides loaded
        return;
      }

      const img = document.createElement('img');
      img.alt = "Movie Pitch Slide " + (index + 1);
      img.classList.add('mobile-slide-image'); // This class has the fadeIn animation

      img.onload = () => {
        // Image has loaded, CSS animation will handle fade-in.
        // Now load the next slide.
        loadMobileSlideAtIndex(index + 1);
      };
      
      img.onerror = () => {
        console.error("Error loading mobile slide image:", slideImagePaths[index]);
        // Still try to load the next slide even if one fails, to not break the chain.
        loadMobileSlideAtIndex(index + 1);
      };

      img.src = slideImagePaths[index]; // Setting src after onload is attached
      mobileSlidesContainer.appendChild(img);
    }

    if (actualNumSlides > 0) {
      loadMobileSlideAtIndex(0); // Start loading the first slide
    }
  }

  function preloadNextDesktopSlide(currentIndex) {
    if (actualNumSlides === 0) return;
    const nextSlideIndex = (currentIndex + 1) % actualNumSlides;
    if (slideImagePaths[nextSlideIndex]) {
      preloadedDesktopImage = new Image();
      preloadedDesktopImage.src = slideImagePaths[nextSlideIndex];
    }
  }

  function displayDesktopImageAndPreloadNext(slideIndex) {
    if (!desktopSlideImageElement) return;
    desktopSlideImageElement.src = slideImagePaths[slideIndex];
    desktopSlideImageElement.classList.remove('cover-image');
    void desktopSlideImageElement.offsetWidth;
    desktopSlideImageElement.classList.add('cover-image');
    preloadNextDesktopSlide(slideIndex);
  }

  function showDesktopSlide(slideIndex, isInitialLoad = false) {
    if (!desktopSlideImageElement) {
      console.error('Desktop slide image element not found.');
      return;
    }
    if (!slideImagePaths[slideIndex]) {
      console.error('Desktop slide path not found for index:', slideIndex);
      desktopSlideImageElement.alt = 'Error loading slide: Path not found.';
      return;
    }

    if (isInitialLoad) {
      displayDesktopImageAndPreloadNext(slideIndex);
    } else {
      desktopSlideImageElement.style.transition = 'opacity 0.7s ease-in-out';
      desktopSlideImageElement.style.opacity = '0';
      setTimeout(() => {
        desktopSlideImageElement.style.transition = '';
        displayDesktopImageAndPreloadNext(slideIndex);
      }, 700);
    }
  }

  function nextDesktopSlide() {
    if (actualNumSlides === 0) return;
    currentDesktopSlide = (currentDesktopSlide + 1) % actualNumSlides;
    showDesktopSlide(currentDesktopSlide);
  }

  function prevDesktopSlide() {
    if (actualNumSlides === 0) return;
    currentDesktopSlide = (currentDesktopSlide - 1 + actualNumSlides) % actualNumSlides;
    showDesktopSlide(currentDesktopSlide);
  }

  function initializeView() {
    if (isMobileView()) {
      if (desktopSlideImageElement) desktopSlideImageElement.style.display = 'none'; // Ensure desktop is hidden
      if (mobileSlidesContainer) mobileSlidesContainer.style.display = 'block'; // Ensure mobile is shown
      setupMobileView();
      // Remove desktop event listeners if they were added
      document.removeEventListener('click', nextDesktopSlide);
      document.removeEventListener('keydown', handleDesktopKeydown);
    } else {
      if (mobileSlidesContainer) mobileSlidesContainer.style.display = 'none'; // Ensure mobile is hidden
      if (desktopSlideImageElement) desktopSlideImageElement.style.display = 'block'; // Ensure desktop is shown
      
      if (actualNumSlides > 0) {
        showDesktopSlide(currentDesktopSlide, true);
      } else {
        console.error("No slides to show for desktop.");
        if (desktopSlideImageElement) {
          desktopSlideImageElement.alt = "No slides available.";
          desktopSlideImageElement.src = "";
        }
      }
      document.addEventListener('click', nextDesktopSlide);
      document.addEventListener('keydown', handleDesktopKeydown);
    }
  }
  
  function handleDesktopKeydown(event) {
    if (event.key === 'ArrowRight') {
      nextDesktopSlide();
    } else if (event.key === 'ArrowLeft') {
      prevDesktopSlide();
    }
  }

  // Initial setup
  initializeView();

  // Optional: Re-initialize on window resize if you want it to be dynamic
  // without a page reload, though this can add complexity.
  // For simplicity, this example initializes on load.
  // window.addEventListener('resize', initializeView);
});