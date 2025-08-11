import { createEffect, createSignal, For, JSXElement, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import "./app.css";
import MyLayout from "./Layout";

export default function Home() {
  return (
    <main class="h-screen flex flex-col">
      <MyLayout />
    </main>
  );
}

