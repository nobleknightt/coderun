import { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Editor from "@/components/editor";
import Chat from "@/components/chat";

function App() {
  const [source, setSource] = useState<string>("");
  const [stdin, setStdin] = useState<string>("");
  const [stdout, setStdout] = useState<string>("");
  const [stderr, setStderr] = useState<string>("");
  const [language, setLanguage] = useState<string>("python");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  async function run() {
    // TODO: focus Output tab when we get non-empty response
    // i.e. either stdout or stderr
    setIsLoading(true);
    const _ = await fetch(
      `${import.meta.env.VITE_API_URL.replace("{language}", language)}/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stdin, source }),
      }
    );
    const response = await _.json();
    setIsLoading(false);
    setStdout(response.stdout);
    setStderr(response.stderr);
    if (response.toast.length !== 0) {
      toast({ description: response.toast });
    }
  }

  async function ping() {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL.replace("{language}", language)}/ping`,
        { method: "GET" }
      );
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(ping, 300000); // 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="w-screen h-screen font-sans p-2 bg-muted">
        <Toaster />
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel
            defaultSize={25}
            className="border rounded-md bg-card min-w-12"
          >
            <Chat />
          </ResizablePanel>
          <ResizableHandle className="w-2 bg-muted" />
          <ResizablePanel defaultSize={75} className="min-w-12">
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel
                defaultSize={75}
                className="border rounded-md bg-card min-h-12"
              >
                <div className="flex flex-col w-full h-full items-center justify-center p-2">
                  <div className="flex gap-1 items-center justify-between w-full border rounded min-h-8 px-1 overflow-hidden">
                    <Select onValueChange={setLanguage} value={language}>
                      <SelectTrigger className="w-40 h-6 px-2 ring-0 focus:ring-0 border-0 hover:bg-accent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="font-sans">
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="cpp">C++ (Clang)</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="rust">Rust</SelectItem>
                          <SelectItem value="javascript">
                            JavaScript (Node.js)
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-1 items-center">
                      <Button
                        variant="ghost"
                        className="h-6 px-2 gap-1 font-medium focus-visible:ring-0"
                        onClick={run}
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
                            <path
                              fillRule="evenodd"
                              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                        Run
                      </Button>
                      <Separator orientation="vertical" className="h-4" />
                      <ModeToggle />
                      <Separator orientation="vertical" className="h-4" />
                      <Button
                        variant="ghost"
                        className="h-6 px-2 focus-visible:ring-0"
                      >
                        <a
                          href="https://github.com/nobleknightt/coderun"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg viewBox="0 0 438.549 438.549">
                            <path
                              fill="currentColor"
                              d="M409.132 114.573c-19.608-33.596-46.205-60.194-79.798-79.8-33.598-19.607-70.277-29.408-110.063-29.408-39.781 0-76.472 9.804-110.063 29.408-33.596 19.605-60.192 46.204-79.8 79.8C9.803 148.168 0 184.854 0 224.63c0 47.78 13.94 90.745 41.827 128.906 27.884 38.164 63.906 64.572 108.063 79.227 5.14.954 8.945.283 11.419-1.996 2.475-2.282 3.711-5.14 3.711-8.562 0-.571-.049-5.708-.144-15.417a2549.81 2549.81 0 01-.144-25.406l-6.567 1.136c-4.187.767-9.469 1.092-15.846 1-6.374-.089-12.991-.757-19.842-1.999-6.854-1.231-13.229-4.086-19.13-8.559-5.898-4.473-10.085-10.328-12.56-17.556l-2.855-6.57c-1.903-4.374-4.899-9.233-8.992-14.559-4.093-5.331-8.232-8.945-12.419-10.848l-1.999-1.431c-1.332-.951-2.568-2.098-3.711-3.429-1.142-1.331-1.997-2.663-2.568-3.997-.572-1.335-.098-2.43 1.427-3.289 1.525-.859 4.281-1.276 8.28-1.276l5.708.853c3.807.763 8.516 3.042 14.133 6.851 5.614 3.806 10.229 8.754 13.846 14.842 4.38 7.806 9.657 13.754 15.846 17.847 6.184 4.093 12.419 6.136 18.699 6.136 6.28 0 11.704-.476 16.274-1.423 4.565-.952 8.848-2.383 12.847-4.285 1.713-12.758 6.377-22.559 13.988-29.41-10.848-1.14-20.601-2.857-29.264-5.14-8.658-2.286-17.605-5.996-26.835-11.14-9.235-5.137-16.896-11.516-22.985-19.126-6.09-7.614-11.088-17.61-14.987-29.979-3.901-12.374-5.852-26.648-5.852-42.826 0-23.035 7.52-42.637 22.557-58.817-7.044-17.318-6.379-36.732 1.997-58.24 5.52-1.715 13.706-.428 24.554 3.853 10.85 4.283 18.794 7.952 23.84 10.994 5.046 3.041 9.089 5.618 12.135 7.708 17.705-4.947 35.976-7.421 54.818-7.421s37.117 2.474 54.823 7.421l10.849-6.849c7.419-4.57 16.18-8.758 26.262-12.565 10.088-3.805 17.802-4.853 23.134-3.138 8.562 21.509 9.325 40.922 2.279 58.24 15.036 16.18 22.559 35.787 22.559 58.817 0 16.178-1.958 30.497-5.853 42.966-3.9 12.471-8.941 22.457-15.125 29.979-6.191 7.521-13.901 13.85-23.131 18.986-9.232 5.14-18.182 8.85-26.84 11.136-8.662 2.286-18.415 4.004-29.263 5.146 9.894 8.562 14.842 22.077 14.842 40.539v60.237c0 3.422 1.19 6.279 3.572 8.562 2.379 2.279 6.136 2.95 11.276 1.995 44.163-14.653 80.185-41.062 108.068-79.226 27.88-38.161 41.825-81.126 41.825-128.906-.01-39.771-9.818-76.454-29.414-110.049z"
                            ></path>
                          </svg>
                        </a>
                      </Button>
                    </div>
                  </div>
                  <Editor setSource={setSource} language={language} />
                </div>
              </ResizablePanel>
              <ResizableHandle className="p-1 bg-muted" />
              <ResizablePanel defaultSize={25} className="min-h-12">
                <ResizablePanelGroup direction="horizontal">
                  <ResizablePanel
                    defaultSize={50}
                    className="border rounded-md bg-card min-w-12"
                  >
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
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                          </svg>
                          Input
                        </span>
                      </div>
                      <Textarea
                        className="h-full rounded focus-visible:ring-0 font-mono text-[14px]"
                        value={stdin}
                        onInput={(
                          event: React.ChangeEvent<HTMLTextAreaElement>
                        ) => setStdin(event.target.value)}
                      />
                    </div>
                  </ResizablePanel>
                  <ResizableHandle className="p-1 bg-muted" />
                  <ResizablePanel
                    defaultSize={50}
                    className="border rounded-md bg-card min-w-12"
                  >
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
                              d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                            />
                          </svg>
                          Output
                        </span>
                      </div>
                      <div className="w-full h-full px-2 overflow-y-auto overflow-x-hidden ">
                      <pre
                        className={`font-mono text-[14px] ${
                          stderr.length !== 0 ? "text-red-400" : ""
                        }`}
                      >
                        {stderr.length !== 0 ? stderr : stdout}
                      </pre>

                      </div>
                    </div>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ThemeProvider>
  );
}

export default App;
