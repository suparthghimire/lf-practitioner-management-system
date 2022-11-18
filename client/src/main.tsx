import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

function Main() {
  useEffect(() => {
    console.log("Render");
  }, []);
  // fetch user data
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
