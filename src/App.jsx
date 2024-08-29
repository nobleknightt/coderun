import { useEffect, useRef, useState } from 'react';
import Editor, { loader } from '@monaco-editor/react';
import oneDarkProTheme from './assets/themes/OneDark-Pro.json';

export default function App() {
  const editorRef = useRef(null);
  const [source, setSource] = useState("")

  useEffect(() => {
    loader.init().then((monaco) => {
      monaco.editor.defineTheme('one-dark-pro', {
        base: 'vs-dark',
        inherit: true,
        rules: oneDarkProTheme.tokenColors,
        colors: oneDarkProTheme.colors,
      });
    });
  }, []);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    editorRef.current.updateOptions({ theme: 'one-dark-pro' });
  }

  // function showValue() {
  //   alert(editorRef.current.getValue());
  // }

  return (
    <div className="h-screen w-screen flex gap-2 p-2 box-border">
      <div className="h-full rounded-lg box-border w-1/2">
      <Editor
        defaultLanguage="python"
        defaultValue={`def hello():\n\tprint("Hello World!")`}
        onMount={handleEditorDidMount}
        options={{
          fontFamily: "'Intel One Mono', monospace",
          fontSize: 16,
          fontWeight: '400',
          minimap: { enabled: false },
        }}
      />
      </div>
      <button 
        className="bg-white w-fit h-8 flex gap-2 items-center justify-center rounded-lg text-black font-semibold px-2 pl-1 pr-3 py-1 box-border"
        onClick={() => setSource(editorRef.current.getValue())}
      >
        <img src="https://img.icons8.com/?size=100&id=93873&format=png&color=000000" width={24} height={24}className="-rotate-90 p-1"></img>
        Run
      </button>
      <pre>{source}</pre>
    </div>
  );
}
