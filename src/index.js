import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
// import { ChakraProvider } from "@chakra-ui/react";
import "../src/App.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <ChakraProvider> */}
    <App />
    {/* </ChakraProvider> */}
  </React.StrictMode>
);
