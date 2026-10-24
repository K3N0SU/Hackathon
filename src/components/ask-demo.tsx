"use client";

import { ArrowUp, Mic, Sprout, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const chats = [
  {
    question: "Can I eat lunch between the rows?",
    answer:
      "Not yet. The label says stay out for 12 hours, and your clock has 4 hours left. Eat outside the block, and wash your hands with soap first.",
  },
  {
    question: "My gloves ripped. Can I keep working?",
    answer:
      "No. The label says chemical-resistant gloves are required. Stop, wash your hands, and ask your supervisor for a new pair. They have to give you one.",
  },
  {
    question: "Is it safe if I'm pregnant?",
    answer:
      "The label does not say. Ask your doctor or call Poison Control at 1-800-222-1222. Until then, stay out of sprayed rows.",
  },
];

export function AskDemo() {
  const box = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [stage, setStage] = useState<"idle" | "asked" | "typing" | "done">(
    "idle",
  );

  useEffect(() => {
    const node = box.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setStage("asked");
      },
      { threshold: 0.4 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (stage === "idle") return;
    const next =
      stage === "asked"
        ? setTimeout(() => setStage("typing"), 600)
        : stage === "typing"
          ? setTimeout(() => setStage("done"), 1400)
          : setTimeout(() => {
              setActive((current) => (current + 1) % chats.length);
              setStage("asked");
            }, 6500);
    return () => clearTimeout(next);
  }, [stage]);

  function pick(index: number) {
    setActive(index);
    setStage("asked");
  }

  const chat = chats[active];

  return (
    <div ref={box} className="card relative overflow-hidden p-0">
      <div className="flex items-center gap-3 border-b px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sprout className="size-4" />
        </span>
        <div>
          <p className="font-semibold">Ask Milpa</p>
          <p className="text-xs text-muted-foreground">
            About: Valley Guard 2EC, scanned 8 hours ago
          </p>
        </div>
      </div>
      <div className="flex min-h-[19rem] flex-col gap-3 p-5" aria-live="polite">
        {stage !== "idle" && (
          <p
            key={`q${active}`}
            className="pop ml-auto max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground"
          >
            {chat.question}
          </p>
        )}
        {stage === "typing" && (
          <p className="pop flex w-fit gap-1.5 rounded-2xl rounded-bl-md bg-secondary px-4 py-4">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="size-2 animate-bounce rounded-full bg-primary/60"
                style={{ animationDelay: `${dot * 0.15}s` }}
              />
            ))}
          </p>
        )}
        {stage === "done" && (
          <div
            key={`a${active}`}
            className="pop max-w-[88%] rounded-2xl rounded-bl-md bg-secondary px-4 py-3 leading-relaxed"
          >
            {chat.answer}
            <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-primary">
              <Volume2 className="size-3.5" />
              Read it to me
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 px-5">
        {chats.map((item, index) => (
          <button
            key={item.question}
            onClick={() => pick(index)}
            className={`rounded-full border px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:border-primary active:scale-95 ${
              index === active
                ? "border-primary bg-primary/5 text-primary"
                : "text-muted-foreground"
            }`}
          >
            {item.question}
          </button>
        ))}
      </div>
      <div className="m-5 flex items-center gap-2 rounded-full border bg-background p-1.5 pl-4">
        <span className="flex-1 text-muted-foreground">
          Ask anything about this label
        </span>
        <span className="flex size-9 items-center justify-center rounded-full text-primary">
          <Mic className="size-5" />
        </span>
        <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <ArrowUp className="size-5" />
        </span>
      </div>
    </div>
  );
}
