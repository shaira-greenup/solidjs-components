import MdxEditor from "~/components/MdxEditor";
import Card from "~/components/Card";
import InteractiveDemo from "~/components/InteractiveDemo";

const defaultContent = `import Card from "./Card";
import InteractiveDemo from "./InteractiveDemo";

# Interactive Learning with MDX

MDX combines the power of **Markdown** with the flexibility of **JSX components**, creating dynamic and interactive content.

## Math Expressions

You can write mathematical expressions using KaTeX:

$$E = mc^2$$

And inline math: $\\sqrt{a^2 + b^2}$

## Interactive Components

Let's explore how components work with an interactive calculator:

<InteractiveDemo 
  title="Square Calculator" 
  label="Choose a number"
  buttonText="Calculate Square"
  min={1}
  max={20}
  initialValue={5}
/>

## Custom Force Calculator

Understanding **F = ma** (Force = mass × acceleration):

<InteractiveDemo 
  title="Force Calculator" 
  label="Mass (kg)"
  buttonText="Calculate Force"
  min={1}
  max={100}
  initialValue={10}
>
  {(mass) => \`Force = \${mass} kg × 9.8 m/s² = \${(mass * 9.8).toFixed(1)} N\`}
</InteractiveDemo>

## Rich Content

<Card title="Features of MDX">

MDX provides a powerful combination of:

- ✨ **Markdown syntax** for easy writing
- 📊 **Interactive components** for dynamic content  
- 🎯 **Real-time compilation** and preview
- 📝 **Code highlighting** with syntax support
- 🧮 **Mathematical expressions** with KaTeX

\`\`\`javascript
// You can even include code blocks
const greeting = "Hello, MDX!";
console.log(greeting);
\`\`\`

Perfect for documentation, tutorials, and interactive learning materials!

</Card>

## Getting Started

1. **Write Markdown**: Use standard markdown syntax
2. **Add Components**: Import and use React/Solid components
3. **Include Math**: Use LaTeX syntax for mathematical expressions
4. **Interactive Elements**: Create engaging user experiences

Try editing the content on the left to see how it renders on the right!
`;

export default function MdxExample() {
  const components = {
    Card,
    InteractiveDemo,
  };

  return (
    <div class="h-screen flex flex-col">
      {/* Header */}
      <div class="bg-white border-b border-gray-300 px-6 py-4">
        <h1 class="text-2xl font-bold text-gray-900">MDX Editor & Preview</h1>
        <p class="text-gray-600 mt-1">
          Edit MDX content on the left and see it rendered on the right with live components
        </p>
      </div>
      
      {/* MDX Editor */}
      <div class="flex-1 overflow-hidden">
        <MdxEditor 
          initialContent={defaultContent}
          components={components}
          className="h-full"
        />
      </div>
    </div>
  );
}