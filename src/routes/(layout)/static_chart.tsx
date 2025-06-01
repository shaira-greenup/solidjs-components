import { useLocation } from "@solidjs/router";
import { ChartConfiguration } from "chart.js";
import { createSignal, createMemo, Suspense, createResource } from "solid-js";
import Card from "~/components/Card";
import ChartComponent from "~/components/Chart";
import { DisplayContent } from "~/components/DisplayCurrentSource";
import Slider from "~/components/Slider";
import { readTextFileFromPath } from "~/utils/fileReader";

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
      <Card>
        <DisplayContent />
      </Card>
    </div>
  );
}

