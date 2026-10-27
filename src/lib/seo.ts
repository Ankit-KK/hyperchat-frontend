import seo from "../data/seo.json";

type PageMeta = { title: string; description: string; noindex?: boolean };
const pages: Record<string, PageMeta> = seo.pages;

/** Also covers dev-server fallbacks and unknown routes; production HTML is built ahead of time. */
export function updatePageSeo(path: string) {
  const page: PageMeta = pages[path] ?? seo.notFound;
  const origin = new URL(import.meta.env.VITE_SITE_URL || seo.siteUrl).origin;
  const canonical = pages[path] ? `${origin}${path === "/" ? "/" : path}` : null;
  const live = document.head.querySelector<HTMLMetaElement>('meta[name="hyperchat-indexing"]')?.content === "enabled" && location.origin === origin;
  document.title = page.title;
  const meta = (key: string, value: string, property = false) => {
    const attribute = property ? "property" : "name";
    let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!node) { node = document.createElement("meta"); node.setAttribute(attribute, key); document.head.append(node); }
    node.content = value;
  };
  meta("description", page.description);
  meta("robots", live && !page.noindex ? "index, follow, max-image-preview:large" : "noindex, follow");
  const shareImage = document.head.querySelector<HTMLMetaElement>('meta[property="og:image"]')?.content || `${location.origin}${seo.image}`;
  meta("og:title", page.title, true);
  meta("og:description", page.description, true);
  meta("og:type", "website", true);
  meta("og:site_name", seo.siteName, true);
  meta("og:image", shareImage, true);
  meta("og:image:alt", seo.imageAlt, true);
  meta("og:image:width", "1200", true);
  meta("og:image:height", "630", true);
  meta("og:locale", "en_IN", true);
  meta("twitter:card", "summary_large_image");
  meta("twitter:title", page.title);
  meta("twitter:description", page.description);
  meta("twitter:image", shareImage);
  meta("twitter:image:alt", seo.imageAlt);
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) {
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.append(link); }
    link.href = canonical;
    meta("og:url", canonical, true);
  } else {
    link?.remove();
    document.head.querySelector('meta[property="og:url"]')?.remove();
    document.head.querySelector('#seo-schema')?.remove();
  }
}
