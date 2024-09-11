import { useEffect, useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
// import clearIcon from "./assets/images/clear.png";
// import outputIcon from "./assets/images/output.png";
// import pythonIcon from "./assets/images/python.png";
// import runIcon from "./assets/images/run.png";
// import oneDarkProTheme from "./assets/themes/OneDark-Pro.json";
import Markdown from 'react-markdown'


export default function App() {
  const editorRef = useRef(null);
  const [ready, setReady] = useState(false)
  const [output, setOutput] = useState("")
  const [suggestion, setSuggestion] = useState("")

  async function ping() {
    setReady(false);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/ping`, { method: "GET" });
      setReady(true);
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    ping();
    const intervalId = setInterval(ping, 300000); // 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   loader.init().then((monaco) => {
  //     monaco.editor.defineTheme("one-dark-pro", {
  //       base: "vs-dark",
  //       inherit: true,
  //       rules: oneDarkProTheme.tokenColors,
  //       colors: oneDarkProTheme.colors,
  //     });
  //   });
  // }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    const isDarkTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    editorRef.current.updateOptions({ theme: isDarkTheme ? "vs-dark" : "vs" });

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
      const newTheme = event.matches ? "vs-dark" : "vs";
      editorRef.current.updateOptions({ theme: newTheme });
    });

    // editorRef.current.updateOptions({ theme: "one-dark-pro" });
  }

  async function runCode() {
    const code = editorRef.current.getValue();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/execute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code }),
        }
      );
      const data = await response.json();
      setOutput(data.output);
      setSuggestion(data.suggestion)
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setSuggestion("")
    }
  }

  function clearCode() {
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  }

  function clearOutput() {
    setOutput("")
    setSuggestion("")
  }

  return (
    <div className="h-screen w-screen grid grid-cols-1 grid-rows-[80%_20%] md:grid-cols-2 md:grid-rows-1 gap-2 p-2 dark:bg-[rgb(30,30,30)]">
      <div className="flex flex-col w-full h-full">
        <div className="w-full min-h-8 flex gap-2 items-center justify-between">
          <div className="h-full w-fit flex items-center justify-center rounded-t border-2 border-b-0 bg-neutral-100 dark:bg-[rgb(30,30,30)] dark:text-white">
            <div className="flex px-2 gap-2 ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm14.25 6a.75.75 0 0 1-.22.53l-2.25 2.25a.75.75 0 1 1-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 1 1 1.06-1.06l2.25 2.25c.141.14.22.331.22.53Zm-10.28-.53a.75.75 0 0 0 0 1.06l2.25 2.25a.75.75 0 1 0 1.06-1.06L8.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-2.25 2.25Z" clipRule="evenodd" />
              </svg>
              <span className="font-medium tracking-tight">Python</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="rounded flex items-center justify-center gap-2 px-2 border-2 bg-neutral-100 outline-0 disabled:cursor-not-allowed dark:bg-[rgb(30,30,30)] dark:text-white" onClick={runCode} disabled={!ready}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              <span className="font-medium tracking-tight">Run</span>
            </button>
            <button className="rounded flex items-center justify-center gap-2 px-2 border-2 bg-neutral-100 outline-0 dark:bg-[rgb(30,30,30)] dark:text-white" onClick={clearCode}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
              </svg>
              <span className="font-medium tracking-tight">Clear</span>
            </button>
          </div>
        </div>
        <div className="h-full w-full border-2 rounded-b rounded-tr bg-neutral-100 p-0.5 dark:bg-[rgb(30,30,30)]">
          <Editor
            defaultLanguage="python"
            defaultValue={`print("Hello World!")`}
            onMount={handleEditorDidMount}
            options={{
              fontFamily: "'Source Code Pro', monospace",
              fontSize: 16,
              fontWeight: "400",
              minimap: { enabled: false },
              letterSpacing: 0.8,
              scrollbar: { useShadows: false },
              wordWrap: "on",
            }}
          />
        </div>
      </div>
      <div className="flex flex-col w-full h-full rounded">
        <div className="w-full min-h-8 flex gap-2 items-center justify-between">
          <div className="h-full w-fit flex items-center justify-center rounded-t border-2 border-b-0 bg-neutral-100 dark:bg-[rgb(30,30,30)] dark:text-white">
            <div className="flex px-2 gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
              </svg>
              <span className="font-medium tracking-tight">Output</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded flex items-center justify-center gap-2 px-2 border-2 bg-neutral-100 outline-0 dark:bg-[rgb(30,30,30)] dark:text-white" onClick={clearOutput}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
              </svg>
              <span className="font-medium tracking-tight">Clear</span>
            </button>
          </div>
        </div>
        <div className="h-full w-full border-2 rounded-b rounded-tr bg-white px-2 py-0 dark:bg-[rgb(30,30,30)] flex flex-col gap-2 items-center justify-center">
          <pre className="grow w-full bg-white overflow-x-auto dark:bg-[rgb(30,30,30)] dark:text-white text-nowrap">
            {output}
          </pre>
          {
            suggestion.length > 0
              ? <div className="bg-neutral-100 dark:bg-neutral-800 dark:text-white mb-2 rounded p-2 flex flex-col gap-2">
                <div className="flex gap-2 items-center justify-center w-fit">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">Suggested Fix</p>
                </div>
                <hr className="w-full"></hr>
                <div className="text-wrap">
                  <Markdown>{suggestion}</Markdown>
                </div>
              </div>
              : null
          }
        </div>
      </div>
    </div>
  );
}
