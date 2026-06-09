"use client";

import { breadcrumbRoutes } from "./breadcrumbRoutes";

export function getBreadcrumb(pathname: string = ""): string {
  if (!pathname) return "";

  const patterns = Object.entries(breadcrumbRoutes).map(([route, label]) => {
    const routeRegex = route
      .replace(/\[.+?\]/g, "[^/]+")
      .replace(/\?/g, "\\?");
    return {
      regex: new RegExp(`^${routeRegex}(?:$|/)`),
      label,
      length: route.length,
    };
  });

  // Ordenamos las claves por longitud descendente para encontrar la coincidencia más específica
  patterns.sort((a, b) => b.length - a.length);

  for (const { regex, label } of patterns) {
    if (regex.test(pathname)) {
      return label;
    }
  }

  return "Inicio"; // fallback
}
