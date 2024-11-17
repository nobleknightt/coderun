import { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Editor, type Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useTheme } from "@/components/theme-provider";

const LanguageDefaultValue = {
  python: `print("Hello World")`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello World" << std::endl;\n    return 0;\n}`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello World")\n}`,
  rust: `fn main() {\n    println!("Hello World");\n}`,
  javascript: `console.log("Hello World");`,
};

interface EditorComponentProps {
  setSource: React.Dispatch<React.SetStateAction<string>>;
  language: string;
}

export default function EditorComponent({
  setSource,
  language,
}: EditorComponentProps) {
  const { theme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;

    // https://pheralb.dev/post/monaco-custom-theme
    monaco.editor.defineTheme("light", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#ffffff",
      },
    });
    monaco.editor.defineTheme("dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#09090b",
      },
    });

    let currentTheme = theme;
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    editor.updateOptions({ theme: currentTheme });
    setSource(editor.getValue());
  }

  useEffect(() => {
    let currentTheme = theme === "dark" ? "dark" : "";
    if (theme === "system") {
      currentTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "";
    }
    editorRef.current?.updateOptions({ theme: currentTheme });
  }, [theme]);

  useEffect(() => {
    editorRef.current?.setValue(
      LanguageDefaultValue[language as keyof typeof LanguageDefaultValue]
    );
  }, [language]);

  return (
    <div className="w-full h-full flex items-center justify-center translate-y-1 overflow-hidden">
      <Editor
        height="98%"
        width="100%"
        defaultLanguage={language}
        defaultValue={
          LanguageDefaultValue[language as keyof typeof LanguageDefaultValue]
        }
        options={{
          fontFamily: "'Source Code Pro', monospace",
          fontSize: 14,
          minimap: { enabled: false },
          // letterSpacing: 0.8,
          scrollbar: { useShadows: false},
          wordWrap: "on",
          contextmenu: false,
        }}
        onMount={handleEditorDidMount}
        onChange={(value) => setSource(value ? value : "")}
        loading={<Skeleton />}
      />
    </div>
  );
}
