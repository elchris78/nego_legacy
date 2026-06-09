import { useEffect } from "react";
import { usePathname } from "next/navigation";

const useInactivity = (
  onInactive: () => void,
  timeout: number = 900000,
  excludedRoutes: string[] = []
): void => {
  let timer: NodeJS.Timeout;
  const pathname = usePathname(); 

  const resetTimer = () => {
    if (excludedRoutes.includes(pathname)) return;

    clearTimeout(timer);
    timer = setTimeout(onInactive, timeout); 
  };

  useEffect(() => {
    const events: string[] = ["mousemove", "mousedown", "keypress", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onInactive, timeout, pathname, excludedRoutes]);
};

export default useInactivity;
