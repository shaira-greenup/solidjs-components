import * as carousel from "@zag-js/carousel";
import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId, Index } from "solid-js";

export function Carousel(props: {
  items: string[];
  slidesPerPage?: number;
  slidesPerMove?: number;
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
  spacing?: string;
  allowMouseDrag?: boolean;
  autoplay?: boolean;
}) {
  const service = useMachine(carousel.machine, {
    id: createUniqueId(),
    slideCount: props.items.length,
    slidesPerPage: props.slidesPerPage || 1,
    slidesPerMove: props.slidesPerMove || 1,
    orientation: props.orientation || "horizontal",
    loop: props.loop || false,
    spacing: props.spacing || "16px",
    allowMouseDrag: props.allowMouseDrag !== false,
    autoplay: props.autoplay || false,
  });

  const api = createMemo(() => carousel.connect(service, normalizeProps));

  return {
    api,
    currentSlide: () => api().page,
    totalSlides: () => props.items.length,
    canGoNext: () => api().canScrollNext,
    canGoPrev: () => api().canScrollPrev,
    goToNext: () => api().scrollNext(),
    goToPrev: () => api().scrollPrev(),
    goToSlide: (index: number) => api().scrollTo(index),
  };
}

export function CarouselComponent(props: {
  items: string[];
  slidesPerPage?: number;
  slidesPerMove?: number;
  orientation?: "horizontal" | "vertical";
  loop?: boolean;
  spacing?: string;
  allowMouseDrag?: boolean;
  autoplay?: boolean;
}) {
  const carouselInstance = Carousel(props);
  const api = carouselInstance.api;

  return {
    component: (
      <div {...api().getRootProps()} class="carousel-root">
        <div {...api().getControlProps()} class="carousel-controls">
          <button
            {...api().getPrevTriggerProps()}
            class="carousel-button carousel-button-prev"
            disabled={!api().canScrollPrev}
          >
            ‹
          </button>
          <button
            {...api().getNextTriggerProps()}
            class="carousel-button carousel-button-next"
            disabled={!api().canScrollNext}
          >
            ›
          </button>
        </div>

        <div {...api().getItemGroupProps()} class="carousel-items">
          <Index each={props.items}>
            {(item, index) => (
              <div {...api().getItemProps({ index })} class="carousel-item">
                <img
                  src={item()}
                  alt={`Slide ${index + 1}`}
                  class="carousel-image"
                />
              </div>
            )}
          </Index>
        </div>

        <div {...api().getIndicatorGroupProps()} class="carousel-indicators">
          <Index each={api().pageSnapPoints}>
            {(_, index) => (
              <button
                {...api().getIndicatorProps({ index })}
                class="carousel-indicator"
              />
            )}
          </Index>
        </div>
      </div>
    ),
    currentSlide: carouselInstance.currentSlide,
    totalSlides: carouselInstance.totalSlides,
    canGoNext: carouselInstance.canGoNext,
    canGoPrev: carouselInstance.canGoPrev,
    goToNext: carouselInstance.goToNext,
    goToPrev: carouselInstance.goToPrev,
    goToSlide: carouselInstance.goToSlide,
  };
}
