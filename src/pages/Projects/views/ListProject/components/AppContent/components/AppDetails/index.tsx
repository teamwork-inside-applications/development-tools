import { AppType } from "@teamworktoolbox/sdk";
import dayjs from "dayjs";
import { FC, useMemo } from "react";
import { FlexDescLine } from "../../../../../../../../components/FlexDescLine";
import { ProjectInfo } from "../../../../../../../../types";

export interface AppDetailsProps {
  activeProjectInfo: ProjectInfo;
}

export const AppDetails: FC<AppDetailsProps> = ({
  activeProjectInfo: { appInfo, indexInfo },
}) => {
  const appType = useMemo(() => {
    if (appInfo.type === AppType.REMOTE_WEB) {
      return "远程WEB站点";
    } else if (appInfo.type === AppType.LOCAL) {
      return "本地资源包";
    }
  }, [appInfo.type]);

  return (
    <div className="app-details">
      <FlexDescLine className="fields" title="名称" value={appInfo.name} />
      <FlexDescLine
        className="fields"
        title="作者"
        value={appInfo.authorInfo?.name}
        disabled
      />
      <FlexDescLine className="fields" title="类型" value={appType} disabled />
      <FlexDescLine
        className="fields"
        title="短描述"
        value={appInfo.shortDesc}
      />
      <FlexDescLine
        className="fields"
        title="创建时间"
        value={dayjs(indexInfo.createAt).format("YYYY-MM-DD HH:mm:ss")}
        disabled
      />
    </div>
  );
};
