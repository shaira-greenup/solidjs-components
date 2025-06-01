import { createSignal } from "solid-js";
import Card from "~/components/Card";
import Slider from "~/components/Slider";


export default function SliderExample() {
  const [value, setValue] = createSignal(50);
  const [uncontrolledValue, setUncontrolledValue] = createSignal(25);

  return (
    <main class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-6 text-[var(--color-base-content)]">
        Slider Examples
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Controlled Slider">
          <Slider
            label="Controlled Value"
            min={0}
            max={100}
            step={1}
            value={value()}
            onChange={setValue}
            showValue={true}
          />

          <div class="mt-4">
            <p class="text-[var(--color-base-content)]">
              Current value: {value()}
            </p>
            <button
              onClick={() => setValue(50)}
              class="mt-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-opacity-90"
            >
              Reset to 50
            </button>
          </div>
        </Card>

        <Card title="Uncontrolled Slider">
          <Slider
            label="Uncontrolled Value"
            min={0}
            max={100}
            defaultValue={25}
            onChange={(val) => setUncontrolledValue(val)}
            showValue={true}
          />

          <div class="mt-4">
            <p class="text-[var(--color-base-content)]">
              Current value: {uncontrolledValue()}
            </p>
          </div>
        </Card>

        <Card title="Disabled Slider">
          <Slider
            label="Disabled Slider"
            min={0}
            max={100}
            defaultValue={75}
            disabled={true}
            showValue={true}
          />
        </Card>

        <Card title="Custom Steps">
          <Slider
            label="Step Size: 10"
            min={0}
            max={100}
            step={10}
            defaultValue={30}
            showValue={true}
          />
        </Card>
      </div>
    </main>
  );
}
