import { RouteSectionProps } from "@solidjs/router";
import Layout from "~/components/Layout";
import NavTree from "~/components/NavTree";

function Sidebar() {
  return <NavTree />;
}

export default function LayoutRoute(props: RouteSectionProps) {
  return (
    <Layout sidebar={<Sidebar />}>
      <div class="p-8 h-full overflow-auto">
        <div class="max-w-4xl mx-auto">
          {props.children}
        </div>
      </div>
    </Layout>
  );
}