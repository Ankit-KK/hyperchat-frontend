import { useState } from "react";
import { Minus, Plus } from "lucide-react";

const questions = [
  [
    "What is HyperChat V2?",
    "A new home for live conversation and shared experiences. HyperChat brings creators and their communities closer together. This interactive site is a first look at that vision.",
  ],
  [
    "Can I start streaming today?",
    "Not yet. HyperChat V2 is in development. Try the listening room on this page to explore the conversation experience. Real streaming, accounts, and community tools are planned for a future release.",
  ],
  [
    "How does the listening room work?",
    "The room is an interactive demo running in your browser. You can choose a topic, send messages, and receive clearly labeled scripted replies. Your conversation stays on this device; no messages are sent to a server or to other people.",
  ],
  [
    "Who is it for?",
    "Curious people. Independent creators. Communities with something to say. Whether you come to share or simply listen, there’s a place for you here.",
  ],
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="questions section-shell" id="questions">
      <div data-reveal>
        <span className="eyebrow">04 / GOOD TO KNOW</span>
        <h2>
          A little
          <br />
          <em>more context.</em>
        </h2>
        <p className="faq-aside">
          Good conversations start
          <br />
          with a little understanding.
        </p>
      </div>
      <div className="faq-list" data-reveal>
        {questions.map(([question, answer], index) => (
          <article className="faq" key={question}>
            <h3>
              <button
                aria-expanded={open === index}
                aria-controls={`answer-${index}`}
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span>
                  <small>0{index + 1}</small>
                  {question}
                </span>
                {open === index ? <Minus size={18} /> : <Plus size={18} />}
              </button>
            </h3>
            <div id={`answer-${index}`} hidden={open !== index}>
              <p>{answer}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
