import { render } from "@testing-library/react";
import ReactQueryProvider from "@/utils/providers/ReactQueryProvider";
import { ReactNode, Suspense } from "react";
import Loading from "../app/[lng]/_components/Loading";

function renderWithReactQueryProviderAndSuspense(component: ReactNode) {
  render(
    <ReactQueryProvider>
      <Suspense fallback={<Loading size={10} />}>{component}</Suspense>
    </ReactQueryProvider>,
  );
}

export function renderWithAuth(component: ReactNode) {
  document.cookie = "token=some-token";
  renderWithReactQueryProviderAndSuspense(component);
}

export function renderWithoutAuth(component: ReactNode) {
  renderWithReactQueryProviderAndSuspense(component);
}
