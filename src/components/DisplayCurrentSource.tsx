import { useLocation } from "@solidjs/router";
import { createMemo, createResource, Suspense } from "solid-js";
import { readTextFileFromPath } from "~/utils/fileReader";
import Card from "./Card";

export function DisplayContent() {
  const location = useLocation();
  //     "./src/routes/(layout)/static_chart.tsx"
  const pathname = createMemo(
    () => "./src/routes/(layout)" + location.pathname + ".tsx",
  );

  const read_file = (file: string) => {
    try {
      return readTextFileFromPath(file);
    } catch (error) {
      // Wrap null in a resolved promise to maintain consistent return type
      return Promise.resolve(null);
    }
  };

  const [content, { mutate, refetch }] = createResource(pathname, read_file);

  return (
    <Suspense fallback={"loading... "}>
      <Card>
        <pre>{content()}</pre>
      </Card>
    </Suspense>
  );
}
