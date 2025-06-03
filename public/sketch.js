document.addEventListener('DOMContentLoaded', () => {
  const desktopSlideImageElement = document.getElementById('slide-image');
  const mobileSlidesContainer = document.getElementById('mobile-slides-container');
  const backgroundAudio = document.getElementById('background-audio');
  const playAudioButton = document.getElementById('play-audio-button');

  // Audio setup
  let audioStarted = false;

  function startAudioPlayback() {
    if (backgroundAudio && !audioStarted) {
      backgroundAudio.play().then(() => {
        audioStarted = true;
        // console.log("Audio started successfully.");
        if (playAudioButton) {
          playAudioButton.style.display = 'none'; // Hide button once audio starts
        }
        // Clean up general interaction listeners if they were for this purpose
        window.removeEventListener('click', initialInteractionListener);
        window.removeEventListener('scroll', initialInteractionListener);
        window.removeEventListener('keydown', initialInteractionListener);
      }).catch(error => {
        console.warn("Audio play attempt failed.", error);
        if (playAudioButton) {
          playAudioButton.style.display = 'block'; // Ensure button is visible if play fails
        }
      });
    }
  }
  
  // This listener is for any first interaction if the button isn't used or as a fallback
  function initialInteractionListener(event) {
    if (event && event.type === 'keydown') {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return;
      }
    }
    // console.log('Initial interaction detected:', event.type);
    startAudioPlayback();
  }


  if (backgroundAudio) {
    backgroundAudio.volume = 0.75; // Set volume

    // Attempt to play immediately
    backgroundAudio.play().then(() => {
      audioStarted = true;
      // console.log("Audio autoplayed successfully.");
      if (playAudioButton) {
        playAudioButton.style.display = 'none';
      }
    }).catch(error => {
      console.warn("Audio autoplay was prevented.", error);
      if (playAudioButton) {
        playAudioButton.style.display = 'block';
        playAudioButton.addEventListener('click', () => {
          // console.log('Play audio button clicked');
          startAudioPlayback();
        });
      }
      // Fallback listeners if button somehow fails or for other interactions
      // These are less critical if the button is the primary mechanism on failure
      window.addEventListener('click', initialInteractionListener, { once: true });
      window.addEventListener('scroll', initialInteractionListener, { once: true });
      window.addEventListener('keydown', initialInteractionListener); // keydown needs manual removal or more complex logic for 'once' like behavior for specific keys
    });
  } else {
    console.warn("Background audio element not found.");
  }

  const slideImagePaths = [
    "slides/1 - COVER.png",
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
    "slides/17 - LITTLE FLOWER@1x.png",
    "slides/18 - IBN@1x.png",
    "slides/19 - JOHN HUDSON@1x.png",
    "slides/21 - CHARACTERS - DEKA@1x.png",
    "slides/22 - CHARACTERS - KLOCK@1x.png",
    "slides/23 - CHARACTERS - THUNDERCLOUD@1x.png",
    "slides/24 - CHARACTERS - OWL@1x.png",
    "slides/25 - SUPPORTING CHARACTERS@1x.png",
    "slides/26 - SEASONS OVERVIEW@1x.png",
    "slides/27 - SERIES OVERVIEW.png",
    "slides/28 - SEASON ONE EPISODIC OVERVIEW.png",
    "slides/29 - LOOK AND FEEL 1.png",
    "slides/30 - LOOK AND FEEL 2.png",
    "slides/31 - TECHNORELIGIOWEAPONS.png",
    "slides/32 - LENAPE CIVILIZATION.png",
    "slides/33 - CASTELLO PLAN.png",
    "slides/34 - ECOSCIENCE.png"
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