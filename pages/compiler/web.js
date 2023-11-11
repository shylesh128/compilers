import { htmlSnippets, cssSnippets } from "@/code/codes";
import { html_beautify } from "js-beautify";
import React, { useState, useRef, useEffect } from "react";

const IndexPage = () => {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const fileNameInputRef = useRef(null);
  const [hide, setHide] = useState(false);
  const [htmlCode, setHtmlCode] = useState(
    `<!DOCTYPE html>\n<html>\n<head>\n  <title>Hello World</title>\n  <style>\n    body {\n      background-color: #fff;\n      font-family: Arial, sans-serif;\n      margin: 10px;\n      padding: 10px;\n    }\n  </style>\n</head>\n<body>\n  <h1>Hello, world!</h1>\n  <p>This is a sample HTML page.</p>\n</body>\n</html>`
  );

  const previewFrameRef = useRef(null);

  const codeTextAreaRef = useRef(null);

  const openSaveDialog = () => {
    const saveDialog = document.getElementById("save-dialog");
    saveDialog.style.display = "block";
  };

  const hidePreview = () => {
    setHide(!hide);
  };

  const saveCode = () => {
    const code = codeTextAreaRef.current.value;
    const fileName = fileNameInputRef.current.value;

    if (fileName) {
      const element = document.createElement("a");
      const file = new Blob([code], { type: "text/html" }); // Use 'text/html' for HTML files
      element.href = URL.createObjectURL(file);
      element.download = fileName.endsWith(".html")
        ? fileName
        : `${fileName}.html`;
      element.click();
    }

    closeSaveDialog();
  };

  const formatCode = () => {
    const formattedHtmlCode = html_beautify(htmlCode, {
      indent_size: 2,
      indent_with_tabs: false,
      wrap_attributes: "force-expand-multiline",
    });
    setHtmlCode(formattedHtmlCode);
  };

  const handleCompile = () => {
    formatCode();
    const previewFrame = previewFrameRef.current;
    const doc = previewFrame.contentDocument;
    doc.open();
    doc.write(htmlCode);
    doc.close();
  };

  const showSuggestions = () => {
    setIsSuggestionsOpen(!isSuggestionsOpen);
    const suggestionsContainer = document.getElementById(
      "suggestions-container"
    );
    suggestionsContainer.innerHTML = "";

    htmlSnippets.forEach((snippet) => {
      const suggestion = document.createElement("div");
      suggestion.classList.add("suggestion");
      suggestion.innerText = snippet.label;
      suggestion.addEventListener("click", () => {
        insertSnippet(snippet);
        suggestionsContainer.style.display = "none";
      });
      suggestionsContainer.appendChild(suggestion);
    });

    suggestionsContainer.style.display = "block";
  };

  const insertSnippet = (snippet) => {
    const textarea = document.getElementById("html-editor");
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selection = textarea.value.substring(startPos, endPos);
    setHtmlCode(
      textarea.value.substring(0, startPos) +
        snippet.value +
        textarea.value.substring(endPos, textarea.value.length)
    );
    textarea.focus();
    textarea.setSelectionRange(
      startPos + snippet.value.length,
      startPos + snippet.value.length
    );
  };

  const closeSaveDialog = () => {
    const saveDialog = document.getElementById("save-dialog");
    saveDialog.style.display = "none";
  };

  useEffect(() => {
    handleCompile();
  }, []);

  return (
    <div
      id="container"
      style={{
        overflow: "hidden",
      }}
    >
      <div
        id="code-editor"
        style={{
          maxWidth: hide ? "100%" : "50%",
        }}
      >
        <textarea
          id="html-editor"
          spellCheck={false}
          value={htmlCode}
          onChange={(e) => setHtmlCode(e.target.value)}
          ref={codeTextAreaRef}
        ></textarea>
        <div
          id="suggestions"
          className="suggestions"
          style={{
            display: isSuggestionsOpen ? "block" : "none",
          }}
        >
          <div id="suggestions-container"></div>
        </div>
        <div>
          <button id="format-btn" onClick={formatCode}>
            Format
          </button>
          <button id="compile-btn" onClick={handleCompile}>
            Compile
          </button>
          <button id="html-snippet-btn" onClick={() => showSuggestions()}>
            suggestions
          </button>
          <button id="save-btn" onClick={openSaveDialog}>
            Save
          </button>
          <button onClick={hidePreview}>{hide ? "Show" : "hide"}</button>
        </div>
      </div>
      <div
        id="canvas-container"
        style={{
          width: "50%",
          display: hide && "none",
        }}
      >
        <iframe
          id="preview-frame"
          width="100%"
          height="100%"
          ref={previewFrameRef}
        ></iframe>
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
      <script src="https://cdn.jsdelivr.net/npm/js-beautify@1.13.0/js/lib/beautify.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/js-beautify@1.13.0/js/lib/beautify-html.js"></script>
    </div>
  );
};

export default IndexPage;
