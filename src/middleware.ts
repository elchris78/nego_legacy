import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const userType = request.cookies.get("user-type")?.value;
  const pathname = request.nextUrl.pathname;

  const isLoginPage = pathname.startsWith("/login");
  // Si no hay token, redirigir al login correspondiente
  if (!token) {
    if (pathname.startsWith("/admin")) {
      // Si estaba en /admin, redirigir a /login/admin
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      // Si estaba en otra ruta, redirigir a /login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  // Si no hay token y no está en la página de login, redirigir al login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Reglas para usuarios "Admin"
  if (userType === "Admin") { // TODO: En un futuro, bloquear rutas de usuario normal que el admin no debería ver
    return NextResponse.next();
  }  
  // if (userType === "Admin") {
  //   if (!pathname.startsWith("/admin") && !isLoginPage) {
  //     return NextResponse.redirect(new URL("/admin", request.url));
  //   }
  // }

  // Reglas para usuarios normales (no admin)
  if (userType !== "Admin") {
    if (pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next(); // Continuar si no hay restricciones
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login|aa-pruebas|recuperar-contrasenia/nueva-contrasenia|recuperar-contrasenia-user/nueva-contrasenia|public).*)"],
};