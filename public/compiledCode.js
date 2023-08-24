// /public/compiledCode.js
const App = () => {
  return React.createElement(
    "div",
    { style: { backgroundColor: "white" } },
    React.createElement("h1", null, "Hello, React Previewer!"),
    React.createElement(
      "p",
      null,
      "This is a simple example to test the preview functionality."
    )
  );
};

ReactDOM.render(React.createElement(App), document.getElementById("root"));
