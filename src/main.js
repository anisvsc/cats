import { gsap } from "gsap";
import SplitText from "gsap/SplitText";

// Register the plugin
gsap.registerPlugin(SplitText);

// refresh when resized
let resizeTimeout;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    location.reload();
  }, 250);
});

document.addEventListener("DOMContentLoaded", () => {
  const profileImageContainer = document.querySelector(".profile-images");
  const profileImages = document.querySelectorAll(".profile-images .img");
  const nameElements = document.querySelectorAll(".profile-names .name");
  const nameHeadings = document.querySelectorAll(".profile-names .name h1");

  // Split each heading into characters and add class to each character
  nameHeadings.forEach((heading) => {
    const split = new SplitText(heading, { type: "chars" });
    split.chars.forEach((char) => {
      char.classList.add("letter");
    });
  });

  // Default (first) name letters animation
  const defaultLetters = nameElements[0].querySelectorAll(".letter");
  gsap.set(defaultLetters, { y: "100%" }); // Start hidden below

  let activeIndex = null;

  if (window.innerWidth >= 900) {
    // Desktop animation logic
    profileImages.forEach((img, index) => {
      const correspondingName = nameElements[index + 1];
      if (!correspondingName) return;

      const letters = correspondingName.querySelectorAll(".letter");

      img.addEventListener("mouseenter", () => {
        gsap.killTweensOf(img);
        gsap.killTweensOf(letters);

        gsap.to(img, {
          width: 120,
          height: 120,
          duration: 0.5,
          ease: "power4.out",
        });

        gsap.to(letters, {
          y: "-100%",
          ease: "power4.out",
          duration: 0.785,
          stagger: {
            each: 0.025,
            from: "center",
          },
        });
      });

      img.addEventListener("mouseleave", () => {
        gsap.killTweensOf(img);
        gsap.killTweensOf(letters);

        gsap.to(img, {
          width: 100,
          height: 100,
          duration: 0.5,
          ease: "power4.out",
        });

        gsap.to(letters, {
          y: "0%",
          ease: "power4.out",
          duration: 0.75,
          stagger: {
            each: 0.025,
            from: "center",
          },
        });
      });
    });

    // Default name animation when hovering on container
    profileImageContainer.addEventListener("mouseenter", () => {
      gsap.killTweensOf(defaultLetters);
      gsap.to(defaultLetters, {
        y: "0%",
        ease: "power4.out",
        duration: 0.75,
        stagger: {
          each: 0.025,
          from: "center",
        },
      });
    });

    profileImageContainer.addEventListener("mouseleave", () => {
      gsap.killTweensOf(defaultLetters);
      gsap.to(defaultLetters, {
        y: "100%", // Reset to original position
        ease: "power4.out",
        duration: 0.75,
        stagger: {
          each: 0.025,
          from: "center",
        },
      });
    });
  } else {
    // ✅ Mobile tap interaction with scale effect
    profileImages.forEach((img, index) => {
      const correspondingName = nameElements[index + 1];
      if (!correspondingName) return;

      const letters = correspondingName.querySelectorAll(".letter");

      // Set initial position
      gsap.set(letters, { y: "0%" });
      gsap.set(img, { scale: 1 });

      img.addEventListener("click", () => {
        if (activeIndex === index) return; // Already active

        // Reset previous name and image
        if (activeIndex !== null && nameElements[activeIndex + 1]) {
          const prevLetters = nameElements[activeIndex + 1].querySelectorAll(".letter");
          const prevImage = profileImages[activeIndex];
          gsap.killTweensOf(prevLetters);
          gsap.killTweensOf(prevImage);

          gsap.to(prevLetters, {
            y: "0%",
            ease: "power4.out",
            duration: 0.5,
            stagger: {
              each: 0.02,
              from: "center",
            },
          });

          gsap.to(prevImage, {
            width: 60, // 👈 Set to the original width of the image
            height: 60, // 👈 Set to the original height of the image
            duration: 0.4,
            ease: "power2.out",
          });
        }

        // Animate current name and image
        gsap.killTweensOf(letters);
        gsap.killTweensOf(img);

        gsap.to(img, {
          width: 80, // 👈 New width on click
          height: 80, // 👈 New height on click
          duration: 0.4,
          ease: "power2.out",
        });

        gsap.to(letters, {
          y: "-100%",
          ease: "power4.out",
          duration: 0.75,
          stagger: {
            each: 0.025,
            from: "center",
          },
        });

        activeIndex = index;
      });
    });

    // Animate in the default name
    gsap.to(defaultLetters, {
      y: "0%",
      ease: "power4.out",
      duration: 0.75,
      stagger: {
        each: 0.025,
        from: "center",
      },
    });
  }
});
