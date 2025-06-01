import { ChartConfiguration } from "chart.js";
import { createSignal, createMemo } from "solid-js";
import Card from "~/components/Card";
import ChartComponent from "~/components/Chart";
import Slider from "~/components/Slider";

export default function SimpleChartPage() {
  const [amplitude, setAmplitude] = createSignal(50);
  // This signal tracks the first render to prevent animation from occurring
  // when the slider modifies the chart data after initial load
  const [isFirstRender, setIsFirstRender] = createSignal(true);

  const chartData = createMemo(() => {
    const data = Array.from(
      { length: 10 },
      (_, i) => Math.sin(i * 0.5) * amplitude(),
    );
    if (isFirstRender()) setIsFirstRender(false);
    return data;
  });

  const chartConfig = createMemo(
    (): ChartConfiguration => ({
      type: "line",
      data: {
        labels: Array.from({ length: 10 }, (_, i) => `Point ${i + 1}`),
        datasets: [
          {
            label: "Sine Wave",
            data: chartData(),
            borderColor: "blue",
            backgroundColor: "lightblue",
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        animation: isFirstRender() ? true : false,
        plugins: {
          title: { display: true, text: "Simple Chart with Slider" },
        },
        scales: {
          y: { beginAtZero: true, min: -100, max: 100 },
        },
      },
    }),
  );

  return (
    <div class="container mx-auto p-4">
      <Card title="Simple Chart Example">
        <div class="mb-4">
          <Slider
            label="Amplitude"
            min={10}
            max={100}
            step={5}
            value={amplitude()}
            onChange={setAmplitude}
            showValue={true}
          />
        </div>
        <ChartComponent chartConfig={chartConfig()} />
      </Card>
    </div>
  );
}
