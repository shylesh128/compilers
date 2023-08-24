const formatJSX = (jsxString) => {
  let formattedLines = [];
  let nestingLevel = 0;
  const INDENT = "  ";
  let buffer = "";

  for (let i = 0; i < jsxString.length; i++) {
    const char = jsxString[i];
    buffer += char;

    if (
      char === ">" ||
      (buffer.trim().startsWith("<") && !buffer.trim().endsWith(">"))
    ) {
      continue;
    }

    const isOpeningTag =
      buffer.trim().startsWith("<") && !buffer.trim().startsWith("</");
    const isClosingTag = buffer.trim().startsWith("</");
    const isSelfClosingTag = buffer.trim().endsWith("/>");

    if (isClosingTag) {
      nestingLevel--;
    }

    const indentation = INDENT.repeat(nestingLevel);
    formattedLines.push(`${indentation}${buffer.trim()}`);

    if (isOpeningTag && !isSelfClosingTag) {
      nestingLevel++;
    }

    buffer = "";
  }

  return formattedLines.join("\n");
};

export const formatReactCode = (codeString) => {
  let state = "JS";
  let buffer = "";
  let formattedCode = [];

  // Keeping track of return statements and parentheses
  let returnCount = 0;
  let parenCount = 0;

  for (let line of codeString.split("\n")) {
    if (state === "JS" && line.trim() === "return (") {
      state = "JSX";
      returnCount++;
      parenCount++;
      buffer = line + "\n";
    } else if (state === "JS" && line.trim().startsWith("//")) {
      state = "SINGLE_COMMENT";
      formattedCode.push(line); // Keep single-line comments as-is
      state = "JS";
    } else if (state === "JS" && line.trim().startsWith("/*")) {
      state = "MULTI_COMMENT";
      buffer = line + "\n";
    } else if (state === "MULTI_COMMENT" && line.trim().endsWith("*/")) {
      buffer += line + "\n";
      formattedCode.push(buffer); // Keep multi-line comments as-is
      buffer = "";
      state = "JS";
    } else if (state === "MULTI_COMMENT") {
      buffer += line + "\n";
    } else if (state === "JSX") {
      buffer += line + "\n";
      if (line.includes("(")) {
        parenCount++;
      }
      if (line.includes(")")) {
        parenCount--;
      }
      if (parenCount === 0) {
        state = "JS";
        formattedCode.push(formatJSX(buffer));
        buffer = "";
      }
    } else {
      formattedCode.push(line);
    }
  }

  return formattedCode.join("\n");
};
