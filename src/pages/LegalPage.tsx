import type { ReactNode } from "react";
import PageIntro from "./PageIntro";
import privacy from "../data/legal/privacy-policy.json";
import terms from "../data/legal/terms-and-conditions.json";
import viewerTerms from "../data/legal/viewer-terms.json";
import refunds from "../data/legal/cancellation-refunds.json";
import "./legal.css";

type Block = { kind: string; text?: string; items?: string[] };
type Policy = {
  slug: string;
  title: string;
  previousVersion?: string;
  audience?: string;
  sections: { id: string; title: string; blocks: Block[] }[];
};
export const policies: Record<string, Policy> = {
  "/privacy-policy": privacy,
  "/terms-and-conditions": terms,
  "/viewer-terms": viewerTerms,
  "/cancellation-refunds": refunds,
};
function linkedText(text: string): ReactNode {
  return text.split(/(ankit@hyperchat\.space)/g).map((part, index) =>
    part === "ankit@hyperchat.space" ? (
      <a key={index} href={`mailto:${part}`}>
        {part}
      </a>
    ) : (
      part
    ),
  );
}
export default function LegalPage({ path }: { path: string }) {
  const policy = policies[path];
  return (
    <>
      <PageIntro
        eyebrow="LEGAL"
        title={policy.title}
        copy={policy.audience ?? "HyperChat · Streamheart Private Limited"}
      />
      <div className="section-shell light legal-layout">
        <aside className="legal-index">
          <nav aria-label="Policy pages">
            {Object.entries(policies).map(([href, item]) => (
              <a
                key={href}
                href={href}
                aria-current={item.slug === policy.slug ? "page" : undefined}
              >
                {item.title}
              </a>
            ))}
          </nav>
          <nav aria-label="On this page">
            <h2>On this page</h2>
            <ol>
              {policy.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <article className="legal-document" aria-label={policy.title}>
          {policy.previousVersion && <p className="legal-version-notice">Revised policies published 24 October 2026; substantive changes effective 7 November 2026. <a href={policy.previousVersion}>Read the previous policy (text)</a>. <a href="/support#contact-support">Contact Support</a>.</p>}
          {policy.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2 id={`${section.id}-heading`}>{section.title}</h2>
              {section.blocks.map((block, index) =>
                block.kind === "heading" ? (
                  <h3 key={index}>{block.text}</h3>
                ) : block.kind === "list" ? (
                  <ul key={index}>
                    {block.items?.map((item, i) => (
                      <li key={i}>{linkedText(item)}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={index}>{linkedText(block.text ?? "")}</p>
                ),
              )}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}
