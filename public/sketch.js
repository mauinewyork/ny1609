document.addEventListener('DOMContentLoaded', () => {
  const desktopSlideImageElement = document.getElementById('slide-image');
  const mobileSlidesContainer = document.getElementById('mobile-slides-container');
  const backgroundAudio = document.getElementById('background-audio');

  // Audio setup
  if (backgroundAudio) {
    backgroundAudio.volume = 0.75; // Set volume to 75%
    // Attempt to play. Modern browsers might block autoplay until user interaction.
    backgroundAudio.play().catch(error => {
      console.warn("Audio autoplay was prevented by the browser. User interaction might be needed to start audio.", error);
      // Optionally, you could add a button or event listener here to start audio on user interaction.
    });
  } else {
    console.warn("Background audio element not found.");
  }

  const slideImagePaths = [
    "slides/1- cover.png",
    "slides/2 - THE ANCIENT ONES.png",
    "slides/3 - LOGLINE.png",
    "slides/4- THE SALT MEN.png",
    "slides/5 - CONTENTS.png",
    "slides/6 - WHY NOW_.png",
    "slides/7 - BACKGROUND.png",
    "slides/8 - CHARACTERS - THE BOY.png",
    "slides/9 - CHARACTERS - HUDSON@1x.png",
    "slides/10 - CHARACTERS - HUDSON@1x.png",
    "slides/11 - CHARACTERS - JUET@1x.png",
    "slides/12 - CHARACTERS - HIGH LIMB@1x.png",
    "slides/13 - CHARACTERS - HARD STICK@1x.png",
    "slides/14 - CHARACTERS - JOHN COLMAN@1x.png",
    "slides/15 - CHARACTERS - WILLOW@1x.png",
    "slides/16 - CHARACTERS - DEKA@1x.png",
    "slides/17 - CHARACTERS - KLOCK@1x.png",
    "slides/18 - CHARACTERS - THUNDERCLOUD@1x.png",
    "slides/19 - CHARACTERS - OWL@1x.png",
    "slides/20 - SUPPORTING CHARACTERS@1x.png",
    "slides/21 - SEASONS OVERVIEW@1x.png",
    "slides/22 - SERIES OVERVIEW.png",
    "slides/23 - SEASON ONE EPISODIC OVERVIEW.png",
    "slides/24 - LOOK AND FEEL 1.png",
    "slides/25 - LOOK AND FEEL 2.png",
    "slides/26 - TECHNORELIGIOWEAPONS.png",
    "slides/27 - LENAPE CIVILIZATION.png",
    "slides/28 - CASTELLO PLAN.png",
    "slides/28 - ECOSCIENCE.png"
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

    slideImagePaths.forEach(path => {
      const img = document.createElement('img');
      img.src = path;
      img.alt = "Movie Pitch Slide"; // Consider more descriptive alt text if possible
      img.classList.add('mobile-slide-image');
      mobileSlidesContainer.appendChild(img);
    });
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