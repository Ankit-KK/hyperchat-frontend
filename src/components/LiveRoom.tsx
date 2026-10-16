import { useEffect, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  AudioLines,
  Check,
  CornerDownLeft,
  Hand,
  Radio,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import "./live-room.css";

type RoomId = "after-hours" | "open-studio" | "good-company";
type Message = { id: string; author: "you" | "demo"; text: string };
type Conversations = Record<RoomId, Message[]>;

const storageKey = "hyperchat.local-rooms.v1";
const messageLimit = 280;
const rooms: {
  id: RoomId;
  number: string;
  title: string;
  category: string;
  description: string;
  opener: string;
  replies: string[];
}[] = [
  {
    id: "after-hours",
    number: "01",
    title: "After hours",
    category: "SOUND / CULTURE / THE IN-BETWEEN",
    description: "The day winds down.\nThe conversation opens up.",
    opener: "Welcome to After hours. What is one song you always come back to?",
    replies: [
      "There is something special about a song that feels like a place. What does it remind you of?",
      "That is the kind of detail that makes a conversation worth staying for. Tell me a little more.",
      "A good recommendation travels. What would you put on next?",
    ],
  },
  {
    id: "open-studio",
    number: "02",
    title: "Open studio",
    category: "IDEAS / PROCESS / WORK IN PROGRESS",
    description: "An unfinished idea.\nA new point of view.",
    opener:
      "Welcome to Open studio. What have you been making, or thinking about making?",
    replies: [
      "Every interesting project starts somewhere small. What is the part you are most curious about?",
      "I like the thought of sharing the process as it happens. What would your first step look like?",
      "Sometimes another pair of eyes changes everything. What would you like a fresh perspective on?",
    ],
  },
  {
    id: "good-company",
    number: "03",
    title: "Good company",
    category: "PEOPLE / STORIES / EVERYDAY THINGS",
    description: "No perfect opening line.\nJust a place to begin.",
    opener:
      "Welcome to Good company. What is a small thing that made your day better?",
    replies: [
      "The little things tend to stay with us. What made that moment feel different?",
      "Thanks for sharing a piece of your day. Is there something you are looking forward to?",
      "That feels like a good place to start. What else has been on your mind?",
    ],
  },
];

function freshConversations(): Conversations {
  return Object.fromEntries(
    rooms.map((room) => [
      room.id,
      [{ id: `${room.id}-welcome`, author: "demo", text: room.opener }],
    ]),
  ) as Conversations;
}

function readConversations(): Conversations {
  const fallback = freshConversations();
  try {
    const raw: unknown = JSON.parse(
      window.localStorage.getItem(storageKey) || "null",
    );
    if (!raw || typeof raw !== "object") return fallback;
    for (const room of rooms) {
      const saved: unknown = (raw as Record<string, unknown>)[room.id];
      if (!Array.isArray(saved)) continue;
      const valid = saved
        .filter(
          (item): item is Message =>
            !!item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            (item.author === "you" || item.author === "demo") &&
            typeof item.text === "string" &&
            item.text.length > 0 &&
            item.text.length <= messageLimit,
        )
        .slice(-40);
      if (valid.length) fallback[room.id] = valid;
    }
  } catch {
    /* A private or restricted browser can still use the room in memory. */
  }
  return fallback;
}

export default function LiveRoom() {
  const [roomId, setRoomId] = useState<RoomId>("after-hours");
  const [joined, setJoined] = useState(false);
  const [conversations, setConversations] =
    useState<Conversations>(readConversations);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState(
    "Choose a room and make yourself at home.",
  );
  const [replyPending, setReplyPending] = useState(false);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chatLog = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const room = rooms.find((item) => item.id === roomId)!;
  const messages = conversations[roomId];

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(conversations));
      setStorageAvailable(true);
    } catch {
      setStorageAvailable(false);
    }
  }, [conversations]);

  useEffect(() => {
    const log = chatLog.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, replyPending]);

  useEffect(
    () => () => {
      if (replyTimer.current) clearTimeout(replyTimer.current);
    },
    [],
  );

  function cancelReply() {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    replyTimer.current = null;
    setReplyPending(false);
  }

  function selectRoom(nextRoom: RoomId) {
    if (nextRoom === roomId) return;
    cancelReply();
    setRoomId(nextRoom);
    setJoined(false);
    setDraft("");
    setError("");
    setStatus(
      `You are previewing ${rooms.find((item) => item.id === nextRoom)!.title}. Join to say hello.`,
    );
  }

  function toggleJoined() {
    if (joined) {
      cancelReply();
      setJoined(false);
      setStatus("You left the demo room. Your conversation is still here.");
    } else {
      setJoined(true);
      setError("");
      setStatus(`You joined the ${room.title} demo. Say something below.`);
      requestAnimationFrame(() =>
        input.current?.focus({ preventScroll: true }),
      );
    }
  }

  function resetConversation() {
    cancelReply();
    setConversations((previous) => ({
      ...previous,
      [roomId]: freshConversations()[roomId],
    }));
    setDraft("");
    setError("");
    setStatus(
      `Conversation reset. Only the welcome message remains in ${room.title}.`,
    );
  }

  function sendMessage(value = draft) {
    if (!joined || replyPending) return;
    const text = value.trim();
    if (!text) {
      setError("Write a little something before you send.");
      input.current?.focus({ preventScroll: true });
      return;
    }
    if (text.length > messageLimit) {
      setError(
        `Keep it to ${messageLimit} characters. A little room for everyone.`,
      );
      input.current?.focus({ preventScroll: true });
      return;
    }
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const replyIndex =
      messages.filter((message) => message.author === "you").length %
      room.replies.length;
    setConversations((previous) => ({
      ...previous,
      [roomId]: [
        ...previous[roomId],
        { id, author: "you" as const, text },
      ].slice(-40),
    }));
    setDraft("");
    setError("");
    setReplyPending(true);
    setStatus("Message sent. A scripted demo reply is on its way.");
    replyTimer.current = setTimeout(() => {
      setConversations((previous) => ({
        ...previous,
        [roomId]: [
          ...previous[roomId],
          {
            id: `${id}-reply`,
            author: "demo" as const,
            text: room.replies[replyIndex],
          },
        ].slice(-40),
      }));
      setReplyPending(false);
      setStatus("Demo reply received. Keep the conversation going.");
      replyTimer.current = null;
    }, 1100);
  }

  return (
    <section
      className="hc-room-section"
      id="live-room"
      aria-labelledby="hc-room-heading"
    >
      <div className="hc-room-eyebrow">
        <span>03 / THE LISTENING ROOM</span>
        <span>
          COME AS YOU ARE <ArrowDownLeft size={13} aria-hidden="true" />
        </span>
      </div>
      <div className="hc-room-intro">
        <h2 id="hc-room-heading">
          A little hello.
          <br />A whole <em>new world.</em>
        </h2>
        <div className="hc-room-intro-copy">
          <p>
            The best way to understand a place
            <br className="hc-room-desktop-break" /> is to spend a little time
            in it.
          </p>
          <p>
            Pick a frequency. Try a conversation.
            <br className="hc-room-desktop-break" /> There is room for your
            voice.
          </p>
        </div>
      </div>

      <div
        className="hc-room-topics"
        role="group"
        aria-label="Choose a demo room"
      >
        {rooms.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === roomId}
            onClick={() => selectRoom(item.id)}
          >
            <span className="hc-room-topic-number">{item.number}</span>
            <span>{item.title}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={`hc-room-shell${joined ? " hc-room-is-joined" : ""}`}>
        <div className="hc-room-stage" data-topic={roomId}>
          <div className="hc-room-stage-top">
            <span>
              <Radio size={14} aria-hidden="true" /> HYPERCHAT FREQUENCIES
            </span>
            <span className="hc-room-demo-tag">LOCAL DEMO</span>
          </div>
          <div className="hc-room-art" aria-hidden="true">
            <div className="hc-room-art-grid" />
            <div className="hc-room-orbit hc-room-orbit-back" />
            <div className="hc-room-orbit hc-room-orbit-front" />
            <div className="hc-room-art-disc">
              <AudioLines size={46} strokeWidth={1.1} />
            </div>
            <span className="hc-room-orbit-point" />
            <span className="hc-room-art-cross hc-room-art-cross-one">+</span>
            <span className="hc-room-art-cross hc-room-art-cross-two">+</span>
            <div className="hc-room-wave">
              {Array.from({ length: 43 }, (_, index) => (
                <i
                  key={index}
                  style={{
                    height: `${7 + Math.abs(Math.sin(index * 1.29)) * Math.sin(((index + 1) / 44) * Math.PI) * 30}px`,
                    animationDelay: `${index * -0.09}s`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="hc-room-stage-copy">
            <span className="hc-room-category">{room.category}</span>
            <h3>
              {room.title}
              <ArrowUpRight size={30} aria-hidden="true" />
            </h3>
            <p>{room.description}</p>
          </div>
          <div className="hc-room-stage-bottom">
            <span className="hc-room-state">
              <i aria-hidden="true" />
              {joined
                ? "YOU’RE IN. MAKE YOURSELF AT HOME."
                : "YOUR SEAT IS RIGHT HERE."}
            </span>
            <span>CH. {room.number}</span>
          </div>
        </div>

        <div className="hc-room-conversation">
          <div className="hc-room-chat-header">
            <div>
              <span className="hc-room-chat-kicker">A SHARED SPACE</span>
              <h3>The conversation</h3>
            </div>
            <button
              type="button"
              className="hc-room-reset"
              onClick={resetConversation}
              aria-label="Reset chat to the welcome message"
              title="Clear this room’s saved messages and return to its welcome message"
            >
              <RotateCcw size={14} aria-hidden="true" />
              <span>Reset chat</span>
            </button>
          </div>
          <p className="hc-room-disclosure">
            An interactive preview, with scripted demo replies. No live stream
            or other participants.
          </p>
          <div
            className="hc-room-messages"
            ref={chatLog}
            role="log"
            tabIndex={0}
            aria-label={`${room.title} demo conversation`}
            aria-live="polite"
            aria-relevant="additions"
            data-lenis-prevent
          >
            {messages.map((message) => (
              <div
                className={`hc-room-message hc-room-message-${message.author}`}
                key={message.id}
              >
                <span className="hc-room-avatar" aria-hidden="true">
                  {message.author === "you" ? "Y" : <AudioLines size={15} />}
                </span>
                <div className="hc-room-message-body">
                  <span className="hc-room-message-author">
                    {message.author === "you" ? "You" : "Demo host"}
                    {message.author === "you" && (
                      <Check size={10} aria-label="Sent" />
                    )}
                  </span>
                  <p>{message.text}</p>
                </div>
              </div>
            ))}
            {replyPending && (
              <div className="hc-room-typing">
                <span aria-hidden="true">···</span> Preparing a demo reply
              </div>
            )}
          </div>

          <div className="hc-room-chat-actions">
            <div className="hc-room-join-row">
              <button
                type="button"
                className={`hc-room-join${joined ? " hc-room-leave" : ""}`}
                onClick={toggleJoined}
              >
                {joined ? (
                  <>
                    <X size={14} aria-hidden="true" /> Leave room
                  </>
                ) : (
                  <>
                    Join room <ArrowUpRight size={15} aria-hidden="true" />
                  </>
                )}
              </button>
              {joined ? (
                <button
                  type="button"
                  className="hc-room-wave-button"
                  onClick={() =>
                    sendMessage("A little hello from me. Glad to be here.")
                  }
                  disabled={replyPending}
                  aria-label="Say hello to the demo room"
                >
                  <Hand size={16} aria-hidden="true" />
                  <span>Say hello</span>
                </button>
              ) : (
                <span className="hc-room-no-signup">
                  No sign-up. Just a hello.
                </span>
              )}
            </div>
            <form
              className="hc-room-compose"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <label className="hc-room-sr-only" htmlFor="hc-room-message">
                Your message
              </label>
              <div
                className={`hc-room-input-wrap${error ? " hc-room-input-error" : ""}`}
              >
                <textarea
                  ref={input}
                  id="hc-room-message"
                  rows={2}
                  value={draft}
                  disabled={!joined}
                  placeholder={
                    joined
                      ? "What’s on your mind?"
                      : "Join the room to say something…"
                  }
                  aria-describedby={`hc-room-input-hint${error ? " hc-room-error" : ""}`}
                  aria-invalid={!!error}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing
                    ) {
                      event.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <button
                  type="submit"
                  className="hc-room-send"
                  aria-label="Send message"
                  disabled={!joined || replyPending}
                >
                  <Send size={16} aria-hidden="true" />
                </button>
              </div>
              <div className="hc-room-input-meta" id="hc-room-input-hint">
                <span>
                  <CornerDownLeft size={10} aria-hidden="true" /> ENTER TO SEND
                  · SHIFT + ENTER FOR A NEW LINE
                </span>
                <span
                  className={
                    draft.length > messageLimit ? "hc-room-over-limit" : ""
                  }
                >
                  {draft.length}/{messageLimit}
                </span>
              </div>
              {error && (
                <p className="hc-room-error" id="hc-room-error" role="alert">
                  {error}
                </p>
              )}
            </form>
            <p className="hc-room-status" role="status">
              {status}
            </p>
          </div>
        </div>
      </div>

      <div className="hc-room-footnote">
        <span>
          <ArrowDownLeft size={18} aria-hidden="true" /> A FIRST TASTE OF
          SOMETHING MORE HUMAN.
        </span>
        <span>
          {storageAvailable
            ? "Messages stay in this browser. The latest 40 per room are saved."
            : "Browser storage is unavailable. Messages last for this visit."}
        </span>
      </div>
    </section>
  );
}
