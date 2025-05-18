
import { useEffect, useState } from "react";

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);

    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

// Original use-mobile hook
export const useMobile = () => {
  return useMediaQuery("(max-width: 768px)");
};

// Add an alias for consistent naming
export const useIsMobile = useMobile;

export default useMobile;
