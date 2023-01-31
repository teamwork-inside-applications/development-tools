import React, { useCallback } from "react";
import { useProjectActive, useProjectAdd, useProjectList } from "../../hooks";
import { ProjectInfo } from "../../types";
import { ProjectData } from "./types";
import { EmptyProject } from "./views/EmptyProject";
import { ListProject } from "./views/ListProject";

export const ProjectContext = React.createContext<ProjectData>({} as any);

export function Projects() {
  const [activeProjectInfo, switchActiveProject] = useProjectActive();
  const [projectList, refreshProjectList] = useProjectList();

  const projectAddConfirm = useCallback(
    (projectInfo: ProjectInfo) => {
      switchActiveProject(projectInfo);
      refreshProjectList();
    },
    [refreshProjectList, switchActiveProject]
  );

  const [projectAddPopupEle, projectAddPopupOperation] =
    useProjectAdd(projectAddConfirm);

  return (
    <ProjectContext.Provider
      value={{
        projectList,
        refreshProjectList,
        projectAddPopupEle,
        projectAddPopupOperation,
        activeProjectInfo,
        switchActiveProject,
      }}
    >
      {!projectList || projectList.length === 0 ? (
        <EmptyProject />
      ) : (
        <ListProject />
      )}
    </ProjectContext.Provider>
  );
}
