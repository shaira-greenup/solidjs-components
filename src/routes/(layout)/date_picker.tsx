import { JSXElement, onCleanup, onMount } from "solid-js";
import { isServer } from "solid-js/web";
import { DatePickerComponent } from "~/components/DatePicker";

function DatePickerCard(props: {
  children: JSXElement;
  selectedDate: () => string | undefined;
}) {
  return (
    <div class="p-6 rounded-lg shadow-sm bg-[var(--color-base-100)] border border-[var(--color-base-300)]">
      <div class="space-y-4">
        <div>
          <label
            class="block text-sm font-medium mb-2"
            style="color: var(--color-base-content)"
          >
            Select Date
          </label>
          {props.children}
        </div>

        <div class="pt-4 border-t" style="border-color: var(--color-base-300)">
          <div class="text-sm" style="color: var(--color-base-content)">
            <span class="opacity-70">Selected:</span>
            <span class="ml-2 font-medium" style="color: var(--color-primary)">
              {props.selectedDate() || "No date selected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DatePickerHeader() {
  return (
    <div class="text-center">
      <h1
        class="text-3xl font-light mb-2"
        style="color: var(--color-base-content)"
      >
        Date Picker
      </h1>
      <p class="text-sm opacity-70" style="color: var(--color-base-content)">
        Select a date from the calendar below
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
          Ctrl+D
        </kbd>{" "}
        to open
      </p>
    </div>
  );
}

function DatePickerDemo() {
  const datePicker = DatePickerComponent();

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "d") {
      e.preventDefault();
      datePicker.focus();
      datePicker.open();
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
    <div class="max-w-md w-full space-y-6">
      <DatePickerHeader />
      <DatePickerCard selectedDate={datePicker.selectedDate}>
        {datePicker.component}
      </DatePickerCard>
    </div>
  );
}

export default function DatePickerPage() {
  return (
    <main
      class="min-h-screen flex items-center justify-center p-8"
      style="background-color: var(--color-base-200)"
    >
      <DatePickerDemo />
    </main>
  );
}
