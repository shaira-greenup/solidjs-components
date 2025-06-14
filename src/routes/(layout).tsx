import { RouteSectionProps } from "@solidjs/router";
import Layout from "~/components/Layout";
import NavTree from "~/components/NavTree";

function Sidebar() {
  return (
    <div class="h-full flex flex-col">
      <NavTree />
    </div>
  );
}

export default function LayoutRoute(props: RouteSectionProps) {
  return (
    <main class="h-screen flex flex-col">
      <Layout sidebar={<Sidebar />}>
        <div class="max-w-4xl mx-auto p-8">
          <div class="bg-[var(--color-base-200)] rounded-xl shadow-sm border border-[var(--color-base-300)] p-8">
            {props.children}
          </div>
        </div>
      </Layout>
    </main>
  );
}
