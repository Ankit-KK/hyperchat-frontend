import PageIntro from "./PageIntro";
import ChangelogBlock from "../components/ui/changelog-2";

export default function WhatsNewPage() {
  return <>
    <PageIntro eyebrow="WHAT’S NEW" title="A little better. Every update."
      copy="Follow the details taking shape across the HyperChat website. Explore the latest improvements to our public pages and interactive previews as we build toward V2." />
    <ChangelogBlock />
  </>;
}
