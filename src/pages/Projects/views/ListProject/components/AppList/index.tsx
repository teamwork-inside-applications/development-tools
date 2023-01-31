import { FC, useContext, useMemo } from "react";
import { AddIcon } from "tdesign-icons-react";
import { Link } from "tdesign-react";
import { ProjectContext } from "../../../..";
import { AppCard } from "../AppCard";

export const AppList: FC = () => {
  const { projectList, projectAddPopupOperation, activeProjectInfo } =
    useContext(ProjectContext);

  const appCardList = useMemo(() => {
    return projectList.map((p) => {
      return (
        <AppCard
          projectInfo={p}
          key={p._id}
          active={
            activeProjectInfo && activeProjectInfo.appInfo.id === p.appInfo.id
          }
        />
      );
    });
  }, [projectList, activeProjectInfo]);

  return (
    <div className="app-list">
      <div className="app-card-wrapper">{appCardList}</div>
      <div className="operation-group">
        <Link
          onClick={projectAddPopupOperation.show}
          theme="primary"
          hover="color"
        >
          <AddIcon />
          新增项目
        </Link>
      </div>
    </div>
  );
};
