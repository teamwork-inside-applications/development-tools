import { FC, useContext } from "react";
import { ProjectContext } from "../..";
import { AppContent } from "./components/AppContent";
import { AppList } from "./components/AppList";
import "./index.scss";

export const ListProject: FC = () => {
  const { projectAddPopupEle } = useContext(ProjectContext);
  return (
    <div className="project-list-wrapper">
      <AppList />
      <AppContent />
      {projectAddPopupEle}
    </div>
  );
};
