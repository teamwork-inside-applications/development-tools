import classNames from "classnames";
import { FC, useCallback, useContext } from "react";
import { ProjectContext } from "../../../..";
import { ProjectInfo } from "../../../../../../types";

export interface AppCardProps {
  projectInfo: ProjectInfo;
  active?: boolean;
}

export const AppCard: FC<AppCardProps> = ({ projectInfo, active }) => {
  const { appInfo } = projectInfo;
  const { switchActiveProject } = useContext(ProjectContext);

  const onClick = useCallback(() => {
    switchActiveProject(projectInfo);
  }, [projectInfo, switchActiveProject]);

  return (
    <div
      onClick={onClick}
      title={appInfo.name}
      className={classNames("app-card", { active })}
    >
      <div className="icon-wrapper">
        <img src={appInfo.icon} alt="图标" />
      </div>
      <div className="text-wrapper">
        <div className="title">
          <span>{appInfo.name}</span>
        </div>
        <div className="short-desc">
          <span>{appInfo.shortDesc}</span>
        </div>
      </div>
    </div>
  );
};
