import dayjs from "dayjs";
import { FC, useCallback, useContext } from "react";
import {
  CloudIcon,
  CodeIcon,
  CreditcardIcon,
  DiscountIcon,
  EllipsisIcon,
} from "tdesign-icons-react";
import { Dropdown, DropdownOption, Tabs } from "tdesign-react";
import { ProjectContext } from "../../../..";
import { Avatar } from "../../../../../../components/Avatar";
import { useProjectDeleteActiveDialog } from "../../../../../../hooks";
import { AppDetails } from "./components/AppDetails";
import { Developer } from "./components/Develop";
import { SafetyTab } from "./components/Safety";

const { TabPanel } = Tabs;

export const AppContent: FC = () => {
  const { activeProjectInfo, refreshProjectList } = useContext(ProjectContext);
  const [deleteDialog, showDeleteDialog] =
    useProjectDeleteActiveDialog(refreshProjectList);
  const dropdownClick = useCallback(
    (dropdownItem: DropdownOption) => {
      if (dropdownItem.value !== "delete" || !activeProjectInfo) {
        return;
      }
      showDeleteDialog(activeProjectInfo);
    },
    [activeProjectInfo, showDeleteDialog]
  );
  return activeProjectInfo ? (
    <>
      <div className="app-content">
        <div className="header-content">
          <div className="app-icon-wrapper">
            <Avatar image={activeProjectInfo.appInfo.icon} />
          </div>
          <div className="app-sample-info">
            <div className="title">
              <span>{activeProjectInfo.appInfo.name}</span>
            </div>
            <div className="create-time">
              <span>
                创建时间:&nbsp;&nbsp;&nbsp;&nbsp;
                {dayjs(activeProjectInfo.indexInfo.createAt).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              </span>
            </div>
            <div
              title={activeProjectInfo.appInfo.shortDesc}
              className="short-desc"
            >
              <span>{activeProjectInfo.appInfo.shortDesc}</span>
            </div>
          </div>
          <div className="operation">
            <Dropdown
              options={[
                {
                  content: "删除项目",
                  value: "delete",
                },
              ]}
              onClick={dropdownClick}
              trigger="click"
            >
              <div
                style={{ cursor: "pointer" }}
                title="更多操作"
                className="btn"
              >
                <EllipsisIcon rotate={45} />
              </div>
            </Dropdown>
          </div>
        </div>
        <div className="tabs-content">
          <Tabs style={{ background: "transparent" }}>
            <TabPanel
              value={0}
              label={
                <>
                  <CreditcardIcon />
                  &nbsp; 信息
                </>
              }
            >
              <AppDetails activeProjectInfo={activeProjectInfo} />
            </TabPanel>
            <TabPanel
              value={1}
              label={
                <>
                  <CodeIcon />
                  &nbsp; 开发
                </>
              }
            ><Developer activeProjectInfo={activeProjectInfo} /></TabPanel>
            <TabPanel
              value={2}
              label={
                <>
                  <CloudIcon />
                  &nbsp; 安全
                </>
              }
            ><SafetyTab activeProjectInfo={activeProjectInfo}/></TabPanel>{" "}
            <TabPanel
              value={3}
              label={
                <>
                  <DiscountIcon />
                  &nbsp; 发布
                </>
              }
            ></TabPanel>
          </Tabs>
        </div>
      </div>
      {deleteDialog}
    </>
  ) : (
    <></>
  );
};
