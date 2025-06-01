import { createSignal, createEffect, JSX } from "solid-js";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
  disabled?: boolean;
}

export default function Slider(props: SliderProps) {
  const [localValue, setLocalValue] = createSignal(
    props.value ?? props.defaultValue ?? props.min ?? 0,
  );

  // If value is provided as a prop, use it as a controlled component
  createEffect(() => {
    if (props.value !== undefined) {
      setLocalValue(props.value);
    }
  });

  const handleChange: JSX.EventHandlerUnion<HTMLInputElement, InputEvent> = (
    event,
  ) => {
    const newValue = parseFloat(event.currentTarget.value);
    setLocalValue(newValue);
    props.onChange?.(newValue);
  };

  return (
    <div class={`${props.className || ""}`}>
      {props.label && (
        <label class="block mb-2 text-sm font-medium text-[var(--color-base-content)]">
          {props.label}
          {props.showValue && (
            <span class="ml-2 text-[var(--color-base-content)] opacity-80">
              {localValue()}
            </span>
          )}
        </label>
      )}
      <input
        type="range"
        min={props.min ?? 0}
        max={props.max ?? 100}
        step={props.step ?? 1}
        value={localValue()}
        onInput={handleChange}
        disabled={props.disabled}
        class="w-full h-2 bg-[var(--color-base-300)] rounded-lg appearance-none cursor-pointer
               accent-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
