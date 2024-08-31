import { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import clearIcon from "./assets/images/clear.png";
import outputIcon from "./assets/images/output.png";
import pythonIcon from "./assets/images/python.png";
import runIcon from "./assets/images/run.png";
// import oneDarkProTheme from './assets/themes/OneDark-Pro.json';

export default function App() {
  const editorRef = useRef(null);
  const [output, setOutput] = useState("")

  // useEffect(() => {
  //   loader.init().then((monaco) => {
  //     monaco.editor.defineTheme('one-dark-pro', {
  //       base: 'vs-dark',
  //       inherit: true,
  //       rules: oneDarkProTheme.tokenColors,
  //       colors: oneDarkProTheme.colors,
  //     });
  //   });
  // }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editorRef.current.updateOptions({ theme: 'vs' });
    // editorRef.current.updateOptions({ theme: 'vs-dark' });
    // editorRef.current.updateOptions({ theme: 'one-dark-pro' });
  }

  async function runCode() {
    const code = editorRef.current.getValue();

    try {
      const response = await fetch(import.meta.env.VITE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  }

  function clearCode() {
    if (editorRef.current) {
      editorRef.current.setValue("");
    }
  }

  function clearOutput() {
    setOutput("")
  }

  return (
    <div className="h-screen w-screen grid grid-cols-2 gap-2 p-2">
      <div className="flex flex-col w-full h-full">
        <div className="w-full min-h-8 flex gap-2 items-center justify-between">
          <div className="h-full w-fit flex items-center justify-center rounded-t border-2 border-b-0 bg-neutral-100">
            <div className="flex px-2 gap-2">
              <img src={pythonIcon} width={24} height={24}></img>
              <span>Python</span>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="rounded flex items-center justify-center gap-2 px-2 border-2 bg-neutral-100 outline-0" onClick={runCode}>
              <img src={runIcon} width={16} className="rotate-90"></img>
              <span>Run</span>
            </button>
            <button className="rounded flex items-center justify-center gap-2 px-2 border-2 bg-neutral-100 outline-0" onClick={clearCode}>
              <img src={clearIcon} width={16}></img>
              <span>Clear</span>
            </button>
          </div>
        </div>
        <div className="h-full w-full border-2 rounded-b rounded-tr bg-neutral-100">
          <Editor
            defaultLanguage="python"
            defaultValue={`print("Hello World!")`}
            onMount={handleEditorDidMount}
            options={{
              fontFamily: "'Intel One Mono', monospace",
              fontSize: 16,
              fontWeight: '400',
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>
      <div className="flex flex-col w-full h-full rounded">
        <div className="w-full min-h-8 flex gap-2 items-center justify-between">
          <div className="h-full w-fit flex items-center justify-center rounded-t border-2 border-b-0 bg-neutral-100">
            <div className="flex px-2 gap-2">
              <img src={outputIcon} width={24}></img>
              <span>Output</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="rounded flex items-center justify-center gap-2 px-2 border-2 bg-neutral-100 outline-0" onClick={clearOutput}>
              <img src={clearIcon} width={16}></img>
              <span>Clear</span>
            </button>
          </div>
        </div>
        <div className="h-full w-full border-2 rounded-b rounded-tr bg-white p-2 pb-0">
          <pre className="h-full w-full bg-white overflow-x-auto">{output}</pre>
        </div>
      </div>
    </div>
  );
}
