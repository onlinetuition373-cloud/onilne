import { Suspense } from "react";
import { FeesView } from "./FeesView";

export default function FeesPage() {
  return (
    <Suspense>
      <FeesView />
    </Suspense>
  );
}
