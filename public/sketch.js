document.addEventListener('DOMContentLoaded', () => {
  const slideImageElement = document.getElementById('slide-image');

  // Explicitly list all slide paths based on the provided file list
  // This ensures all images are included in the correct numerical order.
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
    "slides/28 - ECOSCIENCE.png" // Including both files starting with "28-"
  ];

  const actualNumSlides = slideImagePaths.length;
  let currentSlide = 0;

  function showSlide(slideIndex, isInitialLoad = false) {
    if (!slideImageElement) {
      console.error('Slide image element not found.');
      return;
    }
    if (!slideImagePaths[slideIndex]) {
      console.error('Slide path not found for index:', slideIndex);
      slideImageElement.alt = 'Error loading slide: Path not found.';
      return;
    }

    if (isInitialLoad) {
      slideImageElement.src = slideImagePaths[slideIndex];
      // The 'cover-image' class is already on the element from HTML.
      // Re-applying the class ensures the animation triggers correctly with the new src.
      slideImageElement.classList.remove('cover-image');
      void slideImageElement.offsetWidth; // Force reflow to restart animation
      slideImageElement.classList.add('cover-image');
    } else {
      // Fade out current image
      slideImageElement.style.transition = 'opacity 0.7s ease-in-out';
      slideImageElement.style.opacity = '0';

      setTimeout(() => {
        slideImageElement.src = slideImagePaths[slideIndex];
        // Remove inline transition so CSS animation can take over for fade-in
        slideImageElement.style.transition = '';

        // Re-trigger CSS animation for fade-in by toggling the class
        slideImageElement.classList.remove('cover-image');
        void slideImageElement.offsetWidth; // Force reflow
        slideImageElement.classList.add('cover-image');
        // The 'cover-image' class CSS handles opacity:0 start and animation to opacity:1
      }, 700); // Wait for fade-out (0.7s)
    }
  }

  if (actualNumSlides > 0) {
    showSlide(currentSlide, true); // Load the first slide
  } else {
    console.error("No slides to show. Check slideImagePaths array.");
    if (slideImageElement) {
      slideImageElement.alt = "No slides available.";
      slideImageElement.src = ""; // Clear src if no slides
    }
  }

  function nextSlide() {
    if (actualNumSlides === 0) return;
    currentSlide = (currentSlide + 1) % actualNumSlides;
    showSlide(currentSlide);
  }

  function prevSlide() {
    if (actualNumSlides === 0) return;
    currentSlide = (currentSlide - 1 + actualNumSlides) % actualNumSlides;
    showSlide(currentSlide);
  }

  document.addEventListener('click', nextSlide);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      prevSlide();
    }
  });
});