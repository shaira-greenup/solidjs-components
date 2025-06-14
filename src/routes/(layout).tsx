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
    <main class="min-h-screen flex flex-col bg-[var(--color-base-100)] text-[var(--color-base-content)]">
      <Layout sidebar={<Sidebar />}>
        <div class="w-full max-w-sm mx-auto p-4 sm:max-w-2xl sm:p-6 md:max-w-4xl md:p-8">
          <div class="bg-[var(--color-base-200)] rounded-lg shadow-sm border border-[var(--color-base-300)] p-4 sm:p-6 md:p-8 sm:rounded-xl">
            {props.children}
          </div>
        </div>
      </Layout>
    </main>
  );
}
