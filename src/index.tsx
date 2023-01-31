import React from "react";
import ReactDOM from "react-dom/client";
import "tdesign-react/es/style/index.css";
import "./styles/index.scss";
import App from "./App";
import { db } from "@teamworktoolbox/sdk";

db.sync.index.create({
  fields: ["indexInfo.createAt"],
});

db.sync.index.create({
  fields: ["indexInfo.dataType"],
});

db.sync.index.create({
  fields: ["indexInfo.sorted"],
});

db.sync.index.create({
  fields: ["appInfo.name"],
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
