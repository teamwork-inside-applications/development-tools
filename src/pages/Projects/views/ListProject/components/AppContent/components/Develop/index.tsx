import { FC, useCallback, useContext, useState } from "react"
import { message, MessagePlugin, Switch, SwitchValue, Tabs } from "tdesign-react"
import { ProjectContext } from "../../../../../..";
import { FlexDescLine, TempStoreOperation } from "../../../../../../../../components/FlexDescLine";
import { useProjectActiveUpdate } from "../../../../../../../../hooks";
import { AppDetailsProps } from "../AppDetails";
import { applications } from '@teamworktoolbox/inside-sdk'
import '../index.scss'
import { db } from "@teamworktoolbox/sdk";

const { TabPanel } = Tabs;
export const Developer: FC<AppDetailsProps> = ({
  activeProjectInfo: { appInfo, },
}) => {
  const { activeProjectInfo, refreshProjectList, switchActiveProject } = useContext(ProjectContext)
  const confirmValue = useProjectActiveUpdate(activeProjectInfo, refreshProjectList, switchActiveProject)
  const [ifDebug, setIfDebug] = useState<SwitchValue>(false)
  const onSwitchChange = useCallback(async (value: SwitchValue) => {
    setIfDebug(value)
    if (value) {
      await applications.installWithDebug(appInfo)
    } else {
      await applications.uninstallWithDebug(appInfo.id)
    }
    MessagePlugin.success(`${value ? '开启调试成功！' : '关闭调试成功！'}`)
  }, [appInfo])

  const valueRenderSelect = (value: any, readonly: boolean, tempStore: TempStoreOperation<any>) => {
    return <Switch size="large" value={ifDebug ? true : false} onChange={onSwitchChange} style={{ width: 100 }} label={['开启', '关闭']} />
  }

  return (
    <Tabs className="deveTab" placement='left' style={{ background: "transparent" }}>
      <TabPanel
        value={11}
        label='调试'
      >
        <FlexDescLine
          className="fields"
          title="调试地址"
          value={appInfo.remoteSiteUrl}
          fieldName="remoteSiteUrl"
          valPosition='default'
          confirmValue={confirmValue}
          disabled={ifDebug ? true : false}
        />
        <FlexDescLine
          className="fields"
          title="是否开启调试"
          value={appInfo.type}
          fieldName="type"
          valPosition='default'
          valueRender={valueRenderSelect}
          confirmValue={confirmValue}
          disabled
        /></TabPanel>
      <TabPanel
        value={12}
        label='共享'
      ><h1 style={{ color: "gray", textAlign: "center" }}>暂缓开发~~~</h1></TabPanel>
    </Tabs>
  )
}