import { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
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
    editorRef.current.updateOptions({ theme: 'vs-dark' });
    // editorRef.current.updateOptions({ theme: 'one-dark-pro' });
  }

  async function executeCode() {
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

  return (
    <div className="h-screen w-screen flex gap-2 p-2 box-border bg-neutral-700">
      <div className="h-full rounded-lg box-border w-1/2 relative p-2 bg-[rgba(30,30,30,1)]">
        <button
          className="bg-white w-fit h-8 flex gap-2 items-center justify-center rounded-md text-black font-semibold px-2 pl-1 pr-3 py-1 box-border absolute top-0 right-0 m-2 z-20"
          onClick={executeCode}
        >
          <img src="https://img.icons8.com/?size=100&id=93873&format=png&color=000000" width={24} height={24} className="-rotate-90 p-1"></img>
          Run
        </button>
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
      <div className="h-full rounded-lg box-border w-1/2 p-4 bg-[rgba(30,30,30,1)] overflow-x-auto">
        <pre>{output}</pre>
      </div>
    </div>
  );
}
