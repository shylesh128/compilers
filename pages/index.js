import Link from "next/link";

const HomePage = () => {
  const containerStyle = {
    textAlign: "center",
    margin: "50px auto",
    padding: "20px",
    maxWidth: "600px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const titleStyle = {
    color: "#333",
    fontSize: "36px",
    fontWeight: "bold",
    marginBottom: "20px",
  };

  const descriptionStyle = {
    color: "#666",
    fontSize: "20px",
    marginBottom: "30px",
  };

  const linkContainerStyle = {
    marginTop: "20px",
  };

  const linkStyle = {
    display: "block",
    color: "#007BFF",
    textDecoration: "none",
    fontSize: "20px",
    marginBottom: "10px",
    transition: "color 0.3s ease",
  };

  const linkHoverStyle = {
    color: "#0056b3",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Welcome to My Online Compiler App</h1>
      <p style={descriptionStyle}>
        This is a simple online compiler that supports various languages.
      </p>
      <div style={linkContainerStyle}>
        <Link href="/compiler/react">
          <p style={linkStyle}>Go to React Compiler</p>
        </Link>
        <Link href="/compiler/web">
          <p style={linkStyle}>Go to HTML Compiler</p>
        </Link>
        <Link href="/compiler/javascript">
          <p style={linkStyle}>Go to JavaScript Compiler</p>
        </Link>
        <Link href="/compiler/canva">
          <p style={linkStyle}>Go to Canva Compiler</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
