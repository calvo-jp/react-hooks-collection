import { useRouter } from "next/router";
import nprogress from "nprogress";
import { useEffect } from "react";

nprogress.configure({
  minimum: 0.25,
  showSpinner: false,
  barSelector: '[role="progressbar"]',
  template: '<div role="progressbar" aria-label="Loading page..."></div>',
});

export default function NProgress() {
  const { events } = useRouter();

  useEffect(() => {
    events.on("routeChangeStart", nprogress.start);
    events.on("routeChangeError", nprogress.start);
    events.on("routeChangeComplete", nprogress.done);

    return () => {
      events.off("routeChangeStart", nprogress.start);
      events.off("routeChangeError", nprogress.start);
      events.off("routeChangeComplete", nprogress.done);
    };
  }, [events]);

  return null;
}
