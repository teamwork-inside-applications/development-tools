import { FC, useContext } from "react";
import { AddIcon } from "tdesign-icons-react";
import { Button } from "tdesign-react";
import { ProjectContext } from "../..";
import "./index.scss";

export interface EmptyProjectProps {
  refreshProjectList?(): void;
}

export const EmptyProject: FC<EmptyProjectProps> = () => {
  const { projectAddPopupEle, projectAddPopupOperation } =
    useContext(ProjectContext);
  return (
    <div className="project-empty-wrapper">
      <Button
        onClick={projectAddPopupOperation.show}
        theme="success"
        icon={<AddIcon />}
      >
        新建项目
      </Button>
      {projectAddPopupEle}
    </div>
  );
};
