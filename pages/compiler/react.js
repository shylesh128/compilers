import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { codeSuggestions } from "@/code/codes";

const CodePreview = () => {
  const [prettierPlugins, setPrettierPlugins] = useState(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(true);

  const suggestionsContainerRef = useRef(null);
  const codeTextAreaRef = useRef(null);
  const fileNameInputRef = useRef(null);
  const [code, setCode] = useState(`const App = () => {
    return (
      <div>
        <h2>Hello React Code Previewer!</h2>
        <p>This is a preview of your React component.</p>
      </div>
    );
  };`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPrettierPlugins(window.prettierPlugins);
      formatCode();
    }
  }, []);

  const updatePreview = () => {
    formatCode();
    const code = codeTextAreaRef.current.value;
    const renderString = `ReactDOM.render(<App />, document.getElementById("preview"));`;

    const renderCode = code.concat(renderString);
    try {
      const compiledCode = Babel.transform(renderCode, {
        presets: ["es2015", "react"],
      }).code;
      const renderFunction = new Function("React", "ReactDOM", compiledCode);
      const preview = document.getElementById("preview");
      while (preview.firstChild) {
        preview.removeChild(preview.firstChild);
      }
      renderFunction(React, ReactDOM);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeSaveDialog = () => {
    const saveDialog = document.getElementById("save-dialog");
    saveDialog.style.display = "none";
  };

  const formatCode = () => {
    if (!prettierPlugins) return;

    try {
      const unformattedCode = codeTextAreaRef.current.value;
      const formattedCode = prettier.format(unformattedCode, {
        semi: true,
        parser: "babel",
        plugins: prettierPlugins,
      });

      setCode(formattedCode);
    } catch (e) {
      alert(`Err: ${e}`);
    }
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

  const openSaveDialog = () => {
    const saveDialog = document.getElementById("save-dialog");
    saveDialog.style.display = "block";
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
    if (event.key === "Shift") {
      setIsSuggestionsOpen(false);
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

    const linesBefore = currentCode.substring(0, selectionStart).split("\n");
    const currentLineNumber = linesBefore.length - 1;
    const indentation = linesBefore[currentLineNumber].match(/^\s*/)[0];

    const newCode = `${currentCode.substring(
      0,
      selectionStart
    )}\n${indentation}${code}\n${indentation}${currentCode.substring(
      selectionEnd
    )}`;

    setCode(newCode);
    codeTextAreaRef.current.value = newCode;
    codeTextAreaRef.current.selectionStart =
      selectionStart + indentation.length + 1;
    codeTextAreaRef.current.selectionEnd =
      selectionStart + indentation.length + code.length + 1;
    codeTextAreaRef.current.focus();
    suggestionsContainerRef.current.style.display = "none";
  };

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);
  //   codeTextAreaRef.current.addEventListener("input", handleCodeInput);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  useEffect(() => {
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

  const showSuggestions = () => {
    setIsSuggestionsOpen(!isSuggestionsOpen);
  };

  const toggleTerminalVisibility = () => {
    setTerminalVisible(!terminalVisible);
  };

  return (
    <>
      <Head>
        <title>React compiler</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/prettier/2.0.3/standalone.js"
          integrity="sha512-kZgYwuJlmuFDs982ccZLP9D+TIz/FqkxFQe+G0/TY11X4WqwUZn6P263vtzyt56GThngcoOD9JFvdJsT+D52ow=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/prettier/2.0.3/parser-babel.min.js"
          integrity="sha512-2VpL2CQOwACkU58IzGit5Zvl1cinncah3Pd6k0BEhzRhx7jlCAPtK+b8E10+17TrMFg6Nzs8pZGHBJqAR8Tjbg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
      </Head>
      <div
        className="container"
        style={{
          display: "flex",
          height: "100vh",
        }}
      >
        <div id="code-editor">
          <textarea
            id="code"
            ref={codeTextAreaRef}
            placeholder="Enter your React code here"
            value={code}
            spellCheck="false"
            onChange={(e) => setCode(e.target.value)}
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
            <button onClick={updatePreview}>Render</button>
            <button onClick={openSaveDialog}>Save</button>
            <button onClick={formatCode}>Format</button>
            <button onClick={showSuggestions}>suggestions</button>
            <button
              id="hide-terminal-button"
              onClick={toggleTerminalVisibility}
            >
              {terminalVisible ? "Close" : "Show"}
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
          <div id="preview"></div>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/17.0.2/umd/react.development.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/17.0.2/umd/react-dom.development.js"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
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
      </div>
    </>
  );
};

export default CodePreview;
