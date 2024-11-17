import { useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Markdown from "markdown-to-jsx";
import hljs from "highlight.js/lib/core";
import python from "highlight.js/lib/languages/python";
import { useTheme } from "@/components/theme-provider";

hljs.registerLanguage("python", python);

// https://github.com/quantizor/markdown-to-jsx?tab=readme-ov-file#syntax-highlighting
function SyntaxHighlightedCode(props: any) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current && props.className?.includes("lang-")) {
      hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return (
    <code {...props} ref={ref} className={`rounded my-1 px-1 !bg-background`}/>
  );
}

interface ChatHistoryElement {
  role: "system" | "user" | "assistant";
  content: string;
}

function Chat() {
  const { theme } = useTheme();
  const [chatHistory, setChatHistory] = useState<ChatHistoryElement[]>([
    {
      role: "user",
      content: "Write a python program to print fibonacci numbers.",
    },
    {
      role: "assistant",
      content: `Here's a simple Python program to print Fibonacci numbers:

\`\`\`python
# Function to print Fibonacci numbers up to n terms
def fibonacci(n):
    a, b = 0, 1
    for _ in range(n):
        print(a, end=" ")
        a, b = b, a + b  # Update a and b to the next Fibonacci numbers

# Input: Number of Fibonacci terms to print
n = int(input("Enter the number of Fibonacci terms to print: "))
fibonacci(n)
\`\`\`

### How it works:
1. The function \`fibonacci(n)\` takes an integer \`n\` and prints the first \`n\` Fibonacci numbers.
2. It starts with \`a = 0\` and \`b = 1\`, the first two Fibonacci numbers.
3. Then, it iteratively updates \`a\` and \`b\` to the next pair of Fibonacci numbers in the sequence, printing each one.

### Example output:
If you enter \`10\` for \`n\`, the program will print:
\`\`\`
0 1 1 2 3 5 8 13 21 34
\`\`\`

You can change the number of terms by entering a different value for \`n\`.`,
    },
  ]);

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
    <div className="flex flex-col w-full h-full items-center justify-between p-2">
      <div className="flex items-center px-2 w-full rounded border min-h-8">
        <span className="flex items-center justify-center gap-1 text-sm font-medium">
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
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            />
          </svg>
          Chat
        </span>
      </div>
      <div className="w-full h-full flex flex-col items-center justify-end pb-2 gap-2 text-sm max-w-3xl overflow-y-auto">
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
      <div className="w-full flex gap-2 max-w-3xl">
        <Input
          type="text"
          placeholder="Ask AI ... (Coming Soon)"
          className="w-full focus-visible:ring-0"
        />
        <Button variant="ghost" className="px-2 focus-visible:ring-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6 scale-125"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z"
              clipRule="evenodd"
            />
          </svg>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 scale-125">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 0 1-1.313-1.313V9.564Z" clipRule="evenodd" />
        </svg> */}
        </Button>
      </div>
    </div>
  );
}

export default Chat;
