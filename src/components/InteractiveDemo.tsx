import { createSignal, JSX, ParentProps } from "solid-js";

interface InteractiveDemoProps extends ParentProps {
  title: string;
  label: string;
  buttonText: string;
  min?: number;
  max?: number;
  initialValue?: number;
  children?: (value: number) => string;
}

export default function InteractiveDemo(props: InteractiveDemoProps) {
  const [value, setValue] = createSignal(props.initialValue || 0);
  const [result, setResult] = createSignal("");

  const calculate = () => {
    if (props.children) {
      setResult(props.children(value()));
    } else {
      setResult(`${value()}² = ${value() * value()}`);
    }
  };

  return (
    <div class="border border-gray-300 rounded-lg p-4 my-4 bg-gray-50">
      <h3 class="text-lg font-semibold mb-3">{props.title}</h3>
      
      <div class="flex flex-col gap-3">
        <div class="flex items-center gap-3">
          <label class="font-medium">{props.label}:</label>
          <input
            type="range"
            min={props.min || 0}
            max={props.max || 100}
            value={value()}
            onInput={(e) => setValue(parseInt(e.currentTarget.value))}
            class="flex-1"
          />
          <span class="w-12 text-right font-mono">{value()}</span>
        </div>
        
        <button
          onClick={calculate}
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
        >
          {props.buttonText}
        </button>
        
        {result() && (
          <div class="bg-blue-100 border border-blue-300 rounded p-3 mt-2">
            <strong>Result:</strong> {result()}
          </div>
        )}
      </div>
    </div>
  );
}