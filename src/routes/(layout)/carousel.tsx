import { JSXElement, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { CarouselComponent } from "~/components/Carousel";

const sampleImages = [
  "https://picsum.photos/400/300?random=1",
  "https://picsum.photos/400/300?random=2",
  "https://picsum.photos/400/300?random=3",
  "https://picsum.photos/400/300?random=4",
  "https://picsum.photos/400/300?random=5",
];

function CarouselCard(props: {
  children: JSXElement;
  currentSlide: () => number;
  totalSlides: () => number;
}) {
  return (
    <div class="p-6 rounded-lg shadow-sm bg-[var(--color-base-100)] border border-[var(--color-base-300)]">
      <div class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium mb-2"
            style="color: var(--color-base-content)"
          >
            Image Carousel
          </label>
          {props.children}
        </div>

        <div class="pt-4 border-t" style="border-color: var(--color-base-300)">
          <div class="text-sm" style="color: var(--color-base-content)">
            <span class="opacity-70">Current slide:</span>
            <span class="ml-2 font-medium" style="color: var(--color-primary)">
              {props.currentSlide() + 1} of {props.totalSlides()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CarouselHeader() {
  return (
    <div class="text-center">
      <h1
        class="text-3xl font-light mb-2"
        style="color: var(--color-base-content)"
      >
        Carousel
      </h1>
      <p class="text-sm opacity-70" style="color: var(--color-base-content)">
        Navigate through images with arrow buttons or indicators
      </p>
      <p
        class="text-xs mt-1 opacity-50"
        style="color: var(--color-base-content)"
      >
        Press{" "}
        <kbd
          class="px-1 py-0.5 text-xs rounded"
          style="background-color: var(--color-base-300)"
        >
          ← →
        </kbd>{" "}
        to navigate
      </p>
    </div>
  );
}

function CarouselDemo() {
  const carouselInstance = CarouselComponent({
    items: sampleImages,
    slidesPerPage: 1,
    slidesPerMove: 1,
    loop: true,
    allowMouseDrag: true,
  });

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      carouselInstance.goToPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      carouselInstance.goToNext();
    }
  };

  onMount(() => {
    if (!isServer) {
      document.addEventListener("keydown", handleKeyDown);
    }
  });

  onCleanup(() => {
    if (!isServer && typeof document !== "undefined") {
      document.removeEventListener("keydown", handleKeyDown);
    }
  });

  return (
    <div class="max-w-lg w-full space-y-6">
      <CarouselHeader />
      <CarouselCard
        currentSlide={carouselInstance.currentSlide}
        totalSlides={carouselInstance.totalSlides}
      >
        {carouselInstance.component}
      </CarouselCard>
    </div>
  );
}

export default function CarouselPage() {
  return (
    <main
      class="min-h-screen flex items-center justify-center p-8"
      style="background-color: var(--color-base-200)"
    >
      <CarouselDemo />
      <style jsx>{`
        .carousel-root {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .carousel-controls {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          pointer-events: none;
          z-index: 2;
        }

        .carousel-button {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          color: #333;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
          pointer-events: auto;
        }

        .carousel-button:hover:not(:disabled) {
          background: rgba(255, 255, 255, 1);
          transform: scale(1.05);
        }

        .carousel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .carousel-items {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          gap: 16px;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .carousel-items::-webkit-scrollbar {
          display: none;
        }

        .carousel-item {
          flex-shrink: 0;
          width: 100%;
          scroll-snap-align: start;
        }

        .carousel-image {
          width: 100%;
          height: 300px;
          object-fit: cover;
          border-radius: 8px;
          display: block;
        }

        .carousel-indicators {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 16px;
        }

        .carousel-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .carousel-indicator[data-current] {
          background: var(--color-primary, #3b82f6);
          transform: scale(1.25);
        }

        .carousel-indicator:hover {
          background: var(--color-primary, #3b82f6);
        }
      `}</style>
    </main>
  );
}
