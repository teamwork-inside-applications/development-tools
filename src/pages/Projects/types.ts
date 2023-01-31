import React from "react";
import { ProjectPopupOperation } from "../../hooks";
import { ProjectInfo } from "../../types";

export interface ProjectData {
  projectList: ProjectInfo[];
  refreshProjectList(): void;
  projectAddPopupEle: React.ReactNode;
  projectAddPopupOperation: ProjectPopupOperation;
  activeProjectInfo: ProjectInfo | undefined;
  switchActiveProject(projectInfo: ProjectInfo): Promise<void>;
}
