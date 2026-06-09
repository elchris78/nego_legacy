"use client";

import "@/app/globals.css";
import { Provider } from "react-redux";
import store from "@/lib/store/store";
import { ReactNode, useEffect } from "react";
import { AppProvider } from "@/lib/context/AppProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReduxInitializer } from "@/components/layout/menus/config/ReduxInitializer"; 

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  // Para evitar el warning de Next.js resultan innecesarios
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      const originalWarn = console.warn;
      console.warn = (...args: any[]) => {
        if (
          typeof args[0] === "string" &&
          args[0].includes("has either width or height modified") // Waning de Next.js sobre optimización de imágenes que resulta inncesario c:
        ) {
          return;
        }
        originalWarn(...args);
      };
    }
  }, []);

  return (
    <html lang="en">
      <head />
      <body className="antialiased">
        <Provider store={store}>
          <AppProvider>
            <ReduxInitializer>{children}</ReduxInitializer>
            <ToastContainer
              position="bottom-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </AppProvider>
        </Provider>
      </body>
    </html>
  );
}

