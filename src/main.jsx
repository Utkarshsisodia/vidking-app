import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Create a client with custom configuration to save API calls!
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered "fresh" for 10 minutes.
      // It will NOT make a new API request until 10 mins have passed.
      staleTime: 1000 * 60 * 10,

      // Stop making new requests every time the browser tab regains focus
      refetchOnWindowFocus: false,

      // Optional: If a request fails, only retry once instead of the default 3 times
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);
