import { onMount } from "solid-js";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function Home() {
  let calendarEl!: HTMLDivElement;

  onMount(() => {
    let calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin],
    });
    calendar.render();
  });

  return <div ref={calendarEl} />;
}
