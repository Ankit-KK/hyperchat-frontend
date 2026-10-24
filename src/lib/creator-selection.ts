import type { ShowcaseCreator } from "@/data/showcase-creators";

/** Keep ambassadors visible; give every other supplied creator equal selection odds. */
export function selectShowcaseCreators(creators: ShowcaseCreator[], count = 20) {
  const ambassadors = creators.filter(creator => creator.ambassador);
  const others = creators.filter(creator => !creator.ambassador);
  for (let i = others.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [others[i], others[j]] = [others[j], others[i]];
  }
  return [...ambassadors, ...others.slice(0, Math.max(0, count - ambassadors.length))];
}
