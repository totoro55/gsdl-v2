import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/toaster";
import AutoUploader from "./components/AutoUploader/autoUploader";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" enableSystem={true}>
      <Theme radius="large">
        <RouterProvider router={router} />
      </Theme>
      <Toaster />
      <AutoUploader />
    </ThemeProvider>
  </React.StrictMode>
);
