import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { MobileStickyBar } from "./mobile-sticky-bar";
import { BackToTop } from "./back-to-top";
import { ScrollReveal } from "./scroll-reveal";

export function PageFrame({ children }: { children: React.ReactNode }) {
  return <><SiteHeader /><main className="page-main">{children}</main><SiteFooter /><ScrollReveal /><BackToTop /><MobileStickyBar /></>;
}
