import { useState, useRef, useEffect } from "react";
import Head from "next/head";

import { codeSuggestions } from "@/code/codes";

export default function Home() {
  const [terminalVisible, setTerminalVisible] = useState(true);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const suggestionsContainerRef = useRef(null);
  const codeTextAreaRef = useRef(null);
  const terminalRef = useRef(null);
  const fileNameInputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    codeTextAreaRef.current.addEventListener("input", handleCodeInput);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const runCode = () => {
    terminalRef.current.innerHTML = "";
    const code = codeTextAreaRef.current.value;

    const originalConsoleLog = console.log;
    console.log = function (...args) {
      originalConsoleLog.apply(console, args);
      const message = args.map((arg) => formatArgument(arg)).join(" ");
      const logElement = document.createElement("p");
      logElement.innerHTML = message;
      terminalRef.current.appendChild(logElement);
    };

    try {
      eval(code);
    } catch (error) {
      displayError(error);
    }

    console.log = originalConsoleLog;
  };

  const formatArgument = (arg) => {
    if (typeof arg === "string") {
      return arg;
    } else {
      return JSON.stringify(arg);
    }
  };

  const displayError = (error) => {
    const errorElement = document.createElement("p");
    errorElement.classList.add("error");
    errorElement.textContent = error;
    terminalRef.current.appendChild(errorElement);
  };

  const handleKeyDown = (event) => {
    if (
      event.key === "Enter" &&
      suggestionsContainerRef.current.style.display !== "none"
    ) {
      event.preventDefault();
      const currentInput = getCurrentLineText(codeTextAreaRef.current);
      const matchedSuggestion = codeSuggestions.find((suggestion) =>
        suggestion.label.toLowerCase().startsWith(currentInput.toLowerCase())
      );
      if (matchedSuggestion) {
        insertCodeSnippet(matchedSuggestion.value);
      }
    }
  };

  const getCurrentLineText = (textarea) => {
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const value = textarea.value;
    let lineStart = startPos;
    let lineEnd = endPos;
    while (lineStart > 0 && value.charAt(lineStart - 1) !== "\n") {
      lineStart--;
    }
    while (lineEnd < value.length && value.charAt(lineEnd) !== "\n") {
      lineEnd++;
    }
    return value.substring(lineStart, lineEnd).trim();
  };

  const handleCodeInput = () => {
    const currentInput = codeTextAreaRef.current.value;
    const lines = currentInput.split("\n");
    let matchedSuggestions = [];

    if (lines.length > 0) {
      const currentLine = lines[lines.length - 1];
      matchedSuggestions = codeSuggestions.filter((suggestion) =>
        suggestion.label.toLowerCase().startsWith(currentLine.toLowerCase())
      );
    }
    const currentLine = getCurrentLineText(codeTextAreaRef.current);
    if (currentLine.length !== 0) {
      console.log(matchedSuggestions);
      renderSuggestions(matchedSuggestions);
    }
  };

  const renderSuggestions = (suggestions) => {
    suggestionsContainerRef.current.innerHTML = "";
    if (codeTextAreaRef.current.value.length !== 0) {
      const limitedSuggestions = suggestions.slice(0, 5);

      if (limitedSuggestions.length > 0) {
        const infoText = document.createElement("div");
        infoText.classList.add("suggestion-info");
        infoText.textContent = "Enter/click";
        suggestionsContainerRef.current.appendChild(infoText);
        limitedSuggestions.forEach((suggestion) => {
          const suggestionElement = document.createElement("div");
          suggestionElement.classList.add("suggestion");
          suggestionElement.textContent = suggestion.label;
          suggestionElement.addEventListener("click", () => {
            insertCodeSnippet(suggestion.value);
          });

          suggestionElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              insertCodeSnippet(suggestion.value);
            }
          });

          suggestionsContainerRef.current.appendChild(suggestionElement);
        });

        suggestionsContainerRef.current.style.display = "block";
      } else {
        suggestionsContainerRef.current.style.display = "none";
      }
    }
  };

  const insertCodeSnippet = (code) => {
    const currentCode = codeTextAreaRef.current.value;
    const selectionStart = codeTextAreaRef.current.selectionStart;
    const selectionEnd = codeTextAreaRef.current.selectionEnd;

    const currentLineIndex = getLineNumber(
      codeTextAreaRef.current,
      selectionStart
    );
    const newLineStart = getLineStartPosition(
      codeTextAreaRef.current,
      currentLineIndex
    );
    const newLineEnd = getLineEndPosition(
      codeTextAreaRef.current,
      currentLineIndex
    );
    const newLine = code.substring(0, code.indexOf("\n")).trim();

    const newCode =
      currentCode.substring(0, newLineStart) +
      newLine +
      currentCode.substring(newLineEnd, selectionEnd) +
      code.substring(code.indexOf("\n"));

    codeTextAreaRef.current.value = newCode;
    codeTextAreaRef.current.selectionStart = newLineStart + newLine.length;
    codeTextAreaRef.current.selectionEnd = newLineStart + newLine.length;
    codeTextAreaRef.current.focus();
    suggestionsContainerRef.current.style.display = "none";
  };

  const getLineNumber = (textarea, position) => {
    const value = textarea.value;
    let lineNumber = 0;
    for (let i = 0; i < position; i++) {
      if (value.charAt(i) === "\n") {
        lineNumber++;
      }
    }
    return lineNumber;
  };

  const getLineStartPosition = (textarea, lineIndex) => {
    const value = textarea.value;
    let position = 0;
    let lineNumber = 0;
    while (lineNumber < lineIndex && position < value.length) {
      if (value.charAt(position) === "\n") {
        lineNumber++;
      }
      position++;
    }
    return position;
  };

  const getLineEndPosition = (textarea, lineIndex) => {
    const value = textarea.value;
    let position = getLineStartPosition(textarea, lineIndex);
    while (position < value.length && value.charAt(position) !== "\n") {
      position++;
    }
    return position;
  };

  const formatCode = () => {
    const formattedCode = js_beautify(codeTextAreaRef.current.value);
    codeTextAreaRef.current.value = formattedCode;
  };

  const openSaveDialog = () => {
    const saveDialog = document.getElementById("save-dialog");
    saveDialog.style.display = "block";
  };

  const closeSaveDialog = () => {
    const saveDialog = document.getElementById("save-dialog");
    saveDialog.style.display = "none";
  };

  const saveCode = () => {
    const code = codeTextAreaRef.current.value;
    const fileName = fileNameInputRef.current.value;

    if (fileName) {
      const element = document.createElement("a");
      const file = new Blob([code], { type: "application/javascript" });
      element.href = URL.createObjectURL(file);
      element.download = fileName.endsWith(".js") ? fileName : `${fileName}.js`;
      element.click();
    }

    closeSaveDialog();
  };

  const toggleTerminalVisibility = () => {
    setTerminalVisible(!terminalVisible);
  };

  const showSuggestions = () => {
    setIsSuggestionsOpen(!isSuggestionsOpen);
  };

  useEffect(() => {
    console.log(isSuggestionsOpen);
    if (isSuggestionsOpen) {
      suggestionsContainerRef.current.innerHTML = "";

      const limitedSuggestions = codeSuggestions;

      if (limitedSuggestions.length > 0) {
        const infoText = document.createElement("div");
        infoText.classList.add("suggestion-info");
        infoText.textContent = "Enter/click";
        suggestionsContainerRef.current.appendChild(infoText);
        limitedSuggestions.forEach((suggestion) => {
          const suggestionElement = document.createElement("div");
          suggestionElement.classList.add("suggestion");
          suggestionElement.textContent = suggestion.label;
          suggestionElement.addEventListener("click", () => {
            insertCodeSnippet(suggestion.value);
          });

          suggestionElement.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              insertCodeSnippet(suggestion.value);
            }
          });

          suggestionsContainerRef.current.appendChild(suggestionElement);
        });

        suggestionsContainerRef.current.style.display = "block";
      } else {
        suggestionsContainerRef.current.style.display = "none";
      }
    } else {
      suggestionsContainerRef.current.innerHTML = "";
    }
  }, [isSuggestionsOpen]);

  return (
    <>
      <Head>
        <title>Javascript Compiler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div id="container">
        <div id="code-editor">
          <textarea
            id="code"
            placeholder="Enter your code here..."
            spellCheck="false"
            ref={codeTextAreaRef}
          ></textarea>

          <div
            id="suggestions"
            className="suggestions"
            style={{
              display: isSuggestionsOpen ? "block" : "none",
            }}
            ref={suggestionsContainerRef}
          ></div>
          <div className="buttons">
            <button onClick={runCode}>Run</button>
            <button onClick={openSaveDialog}>Save</button>
            <button onClick={formatCode}>Format</button>
            <button onClick={showSuggestions}>suggestions</button>
            <button
              id="hide-terminal-button"
              onClick={toggleTerminalVisibility}
            >
              {terminalVisible ? "Hide Terminal" : "Show Terminal"}
            </button>
          </div>
        </div>

        <div
          id="terminal-container"
          style={{
            display: terminalVisible ? "block" : "none",
            "@media (maxWidth: 768px)": {
              display: "none",
            },
          }}
        >
          <div id="terminal" ref={terminalRef}></div>
        </div>

        <div id="save-dialog" className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeSaveDialog}>
              &times;
            </span>
            <label htmlFor="file-name-input">File Name:</label>
            <input
              type="text"
              id="file-name-input"
              placeholder="Enter file name..."
              ref={fileNameInputRef}
            />
            <button onClick={saveCode}>Save</button>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/js-beautify/js/lib/beautify.js"></script>
      </div>
    </>
  );
}
