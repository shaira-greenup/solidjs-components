import { ChartConfiguration } from "chart.js";
import { createSignal, createMemo } from "solid-js";
import Card from "~/components/Card";
import ChartComponent from "~/components/Chart";
import Slider from "~/components/Slider";

export default function SimpleChartPage() {
  const amplitude = 50;
  const data = Array.from(
    { length: 10 },
    (_, i) => Math.sin(i * 0.5) * amplitude,
  );

  const chartConfig = {
    type: "line",
    data: {
      labels: Array.from({ length: 10 }, (_, i) => `Point ${i + 1}`),
      datasets: [
        {
          label: "Sine Wave",
          data: data,
          borderColor: "blue",
          backgroundColor: "lightblue",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      animation: true,
      plugins: {
        title: { display: true, text: "Simple Chart with Slider" },
      },
      scales: {
        y: { beginAtZero: true, min: -100, max: 100 },
      },
    },
  };

  return (
    <div class="container mx-auto p-4">
      <Card title="Simple Chart Example">
        <div class="mb-4"></div>
        <ChartComponent chartConfig={chartConfig} />
      </Card>
    </div>
  );
}
