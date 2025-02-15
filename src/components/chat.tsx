import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { useTheme } from "@/components/theme-provider";
import { Separator } from "./ui/separator";

hljs.registerLanguage("python", python);

// https://github.com/quantizor/markdown-to-jsx?tab=readme-ov-file#syntax-highlighting
function SyntaxHighlightedCode(props: any) {
  const ref = useRef<HTMLElement | null>(null);
  const [isCodeBlock, setIsCodeBlock] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-")) {
      hljs.highlightElement(ref.current);
      setIsCodeBlock(true);
      const language = props.className?.split("-").pop(); // written using CodeRun AI Chat
      setLanguage(language);
      if (ref.current.textContent) {
        setCode(ref.current.textContent);
      }

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => setIsCopied(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  return (
    <>
      {isCodeBlock ? (
        <>
          <div className="w-full inline-flex items-center justify-between bg-background rounded-t">
            <span className="px-2 py-1 text-xs !font-sans">
              {language ? language : ""}
            </span>
            <button
              className="px-2 inline-flex items-center justify-center gap-1 py-1 text-xs !font-sans hover:bg-accent m-1 rounded"
              onClick={() => {
                window.navigator.clipboard.writeText(code);
                setIsCopied(true);
              }}
            >
              {isCopied ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
          <Separator></Separator>
        </>
      ) : null}
      <code
        {...props}
        ref={ref}
        className={`relative rounded-b px-1 !bg-background`}
      />
    </>
  );
}

interface ChatHistoryElement {
  role: "user" | "assistant";
  content: string;
}

function Chat() {
  const { theme } = useTheme();
  const [chatHistory, setChatHistory] = useState<ChatHistoryElement[]>([]);
  const [userContent, setUserContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // TODO: add retry option in case of error/failure
  async function getChatResponse() {
    const updatedChatHistory: ChatHistoryElement[] = [
      ...chatHistory,
      { role: "user", content: userContent },
    ];
    setChatHistory(updatedChatHistory);
    setIsLoading(true);
    setUserContent("");
    const _ = await fetch(`${import.meta.env.VITE_CHAT_API_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedChatHistory),
    });
    const response = await _.json();
    setIsLoading(false);
    setChatHistory(response);
  }

  async function ping() {
    try {
      await fetch(`${import.meta.env.VITE_CHAT_API_URL}/ping`, {
        method: "GET",
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(ping, 300000); // 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let currentTheme = theme === "dark" ? "dark" : "light";
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    const style = document.createElement("style");
    if (currentTheme == "light") {
      style.innerHTML = `pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#fff;color:#000}.hljs-comment,.hljs-quote,.hljs-variable{color:green}.hljs-built_in,.hljs-keyword,.hljs-name,.hljs-selector-tag,.hljs-tag{color:#00f}.hljs-addition,.hljs-attribute,.hljs-literal,.hljs-section,.hljs-string,.hljs-template-tag,.hljs-template-variable,.hljs-title,.hljs-type{color:#a31515}.hljs-deletion,.hljs-meta,.hljs-selector-attr,.hljs-selector-pseudo{color:#2b91af}.hljs-doctag{color:grey}.hljs-attr{color:red}.hljs-bullet,.hljs-link,.hljs-symbol{color:#00b0e8}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}`;
    } else {
      style.innerHTML = `pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#1e1e1e;color:#dcdcdc}.hljs-keyword,.hljs-literal,.hljs-name,.hljs-symbol{color:#569cd6}.hljs-link{color:#569cd6;text-decoration:underline}.hljs-built_in,.hljs-type{color:#4ec9b0}.hljs-class,.hljs-number{color:#b8d7a3}.hljs-meta .hljs-string,.hljs-string{color:#d69d85}.hljs-regexp,.hljs-template-tag{color:#9a5334}.hljs-formula,.hljs-function,.hljs-params,.hljs-subst,.hljs-title{color:#dcdcdc}.hljs-comment,.hljs-quote{color:#57a64a;font-style:italic}.hljs-doctag{color:#608b4e}.hljs-meta,.hljs-meta .hljs-keyword,.hljs-tag{color:#9b9b9b}.hljs-template-variable,.hljs-variable{color:#bd63c5}.hljs-attr,.hljs-attribute{color:#9cdcfe}.hljs-section{color:gold}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-bullet,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-selector-pseudo,.hljs-selector-tag{color:#d7ba7d}.hljs-addition{background-color:#144212;display:inline-block;width:100%}.hljs-deletion{background-color:#600;display:inline-block;width:100%}`;
    }
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  return (
    <div className="flex flex-col w-full h-full items-center justify-between gap-2 p-2">
      <div className="flex items-center px-2 w-full rounded border min-h-8 min-w-8">
        <span className="flex items-center justify-start gap-1 text-sm font-medium overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4 min-w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          Chat
        </span>
      </div>
      <div className="w-full h-full overflow-y-auto">
        <div className="m-auto flex flex-col items-center justify-end gap-2 text-sm max-w-3xl">
          {chatHistory.map((value, index) => (
            <div
              key={`chat-history-${index}`}
              className={`w-full flex ${
                value.role === "user"
                  ? "pl-10 justify-end"
                  : "pr-10 justify-start"
              }`}
            >
              <div className="bg-muted rounded px-4 py-2 max-w-full markdown">
                <Markdown
                  children={value.content}
                  options={{
                    overrides: {
                      code: SyntaxHighlightedCode,
                    },
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full flex gap-2 max-w-3xl">
        <Input
          type="text"
          value={userContent}
          onInput={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserContent(event.target.value)
          }
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              getChatResponse();
            }
          }}
          placeholder="Ask AI ..."
          className="w-full focus-visible:ring-0 min-w-8"
        />
        <Button
          variant="ghost"
          className="px-2 focus-visible:ring-0"
          onClick={getChatResponse}
        >
          {isLoading ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <style>
                {`
                  .spinner_ajPY {
                    transform-origin: center;
                    animation: spinner_AtaB 0.75s infinite linear;
                  }

                  @keyframes spinner_AtaB {
                    100% {
                      transform: rotate(360deg);
                    }
                  }
                `}
              </style>
              <path
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                opacity=".25"
                fill="currentColor"
              />
              <path
                d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
                className="spinner_ajPY"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}

export default Chat;
