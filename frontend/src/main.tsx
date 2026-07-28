import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { ToastProvider } from "./utils/toast.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NetworkProvider from "./utils/Network.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <NetworkProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NetworkProvider>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
);