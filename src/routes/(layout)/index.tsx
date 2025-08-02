import { A } from "@solidjs/router";
import { JSX } from "solid-js";
import { tv } from "tailwind-variants";

// Easy to update - just add/remove items from this array
const favoriteLayouts = [
  {
    title: "Side Drawer with Bottom Dash",
    description: "Mobile-friendly layout with sidebar and bottom navigation",
    path: "/layout_examples/side_drawer/with_bottom_dash/side_drawer_sandbox",
    category: "Featured"
  },
  {
    title: "Side Drawer Sandbox", 
    description: "Basic side drawer with resizable sidebar",
    path: "/layout_examples/side_drawer/side_drawer_sandbox",
    category: "Layouts"
  },
  {
    title: "Simple Drawer",
    description: "Minimal drawer implementation", 
    path: "/layout_examples/simple_drawer/simple_drawer_example",
    category: "Layouts"
  },
  {
    title: "Accordion Layout",
    description: "Simple accordion-based layout",
    path: "/layout_examples/accordian/accordian_example", 
    category: "Layouts"
  },
  {
    title: "Command Palette",
    description: "Professional command palette with fuzzy search",
    path: "/command_palette",
    category: "Components"
  },
  {
    title: "Date Picker", 
    description: "Interactive date picker with keyboard navigation",
    path: "/date_picker",
    category: "Components"
  }
];

// Tailwind Variants for all styles
const styles = {
  main: tv({
    base: "max-w-4xl mx-auto p-6"
  }),
  
  header: tv({
    base: "mb-8"
  }),
  
  title: tv({
    base: "text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2"
  }),
  
  subtitle: tv({
    base: "text-gray-600 dark:text-gray-400"
  }),
  
  section: tv({
    base: "mb-8"
  }),
  
  categoryTitle: tv({
    base: "text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2"
  }),
  
  grid: tv({
    base: "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
  }),
  
  fancyCard: tv({
    base: [
      "block p-4 rounded-lg border border-gray-200 dark:border-gray-700",
      "bg-white dark:bg-gray-800",
      "transition-all duration-300 ease-out transform-gpu",
      "hover:scale-105 hover:-rotate-1 hover:shadow-xl hover:shadow-blue-500/10",
      "hover:border-blue-300 dark:hover:border-blue-600",
      "hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50",
      "dark:hover:from-gray-750 dark:hover:to-gray-700",
      "active:scale-95 active:rotate-0"
    ]
  }),
  
  cardTitle: tv({
    base: "font-medium text-gray-900 dark:text-gray-100 mb-2"
  }),
  
  cardDescription: tv({
    base: "text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
  }),
  
  footer: tv({
    base: "mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
  }),
  
  footerText: tv({
    base: "text-sm text-gray-500 dark:text-gray-500"
  }),
  
  codeInline: tv({
    base: "px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs"
  })
};

// Fancy hover component with slick animations
function FancyHover(props: { children: JSX.Element; href: string }) {
  return (
    <A 
      href={props.href}
      class={styles.fancyCard()}
      style={{
        "transform-origin": "center",
        "backface-visibility": "hidden",
        "perspective": "1000px"
      }}
    >
      {props.children}
    </A>
  );
}

export default function Home() {
  // Group items by category
  const groupedLayouts = favoriteLayouts.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof favoriteLayouts>);

  return (
    <main class={styles.main()}>
      <div class={styles.header()}>
        <h1 class={styles.title()}>
          Developer Bookmarks
        </h1>
        <p class={styles.subtitle()}>
          Quick access to layout examples and components currently in development
        </p>
      </div>

      {Object.entries(groupedLayouts).map(([category, items]) => (
        <section class={styles.section()}>
          <h2 class={styles.categoryTitle()}>
            {category}
          </h2>
          <div class={styles.grid()}>
            {items.map((item) => (
              <FancyHover href={item.path}>
                <h3 class={styles.cardTitle()}>
                  {item.title}
                </h3>
                <p class={styles.cardDescription()}>
                  {item.description}
                </p>
              </FancyHover>
            ))}
          </div>
        </section>
      ))}

      <div class={styles.footer()}>
        <p class={styles.footerText()}>
          <strong>Note:</strong> To add new bookmarks, edit the <code class={styles.codeInline()}>favoriteLayouts</code> array in this file.
        </p>
      </div>
    </main>
  );
}