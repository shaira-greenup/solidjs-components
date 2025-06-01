import KaTeX from "~/components/KaTeX";

export default function katexPage() {
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <h1 class="max-6-xs text-4xl text-sky-700 font-thin  my-16">
        <KaTeX
          math="\textrm{Examples of \LaTeX using \KaTeX}"
          displayMode={true}
        />
      </h1>
      <KaTeX math="x^2 + y^2 = z^2" displayMode={true} />
    </main>
  );
}
