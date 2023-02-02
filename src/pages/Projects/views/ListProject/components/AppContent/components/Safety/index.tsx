import { FC, useCallback, useContext, useState } from "react";
import { Button, MessagePlugin, Select, Switch, SwitchValue, Tabs } from "tdesign-react";
import { ProjectContext } from "../../../../../..";
import { FlexDescLine } from "../../../../../../../../components/FlexDescLine";
import { useProjectActiveUpdate } from "../../../../../../../../hooks";
import { AddAppsInfoTosdkFn, DeleteAppIdFn } from "../../../../../../../../requests";
import { tryCatchFinally } from "../../../../../../../../tools";
import { AppDetailsProps } from "../AppDetails";

const { TabPanel } = Tabs;
const styles = { width: 244 }

const personEnum = [
  { label: '人员', value: 'person' },
  { label: '机构', value: 'org' },
  { label: '机构和人员', value: 'all' }
]

export const SafetyTab: FC<AppDetailsProps> = ({ activeProjectInfo: { appInfo } }) => {
  const { activeProjectInfo, refreshProjectList, switchActiveProject } = useContext(ProjectContext)
  const confirmValue = useProjectActiveUpdate(activeProjectInfo, refreshProjectList, switchActiveProject)
  const [ifDebug, setIfDebug] = useState<SwitchValue>(false)
  const [ifVisible, setIfvisible] = useState<SwitchValue>(false)
  const [select, setSelect] = useState<'person' | 'org' | 'all'>()

  const onSwitchChange = useCallback(async (value: SwitchValue) => {
    if (value) {
      const rst = await AddAppsInfoTosdkFn(appInfo)
      console.log(rst);
      return
    } else {
      tryCatchFinally(async () => {
        await DeleteAppIdFn(appInfo.id)
      })
    }
    setIfDebug(value)
    MessagePlugin.success(`${value ? '开启服务器SDK成功！' : '关闭服务器SDK成功！'}`)
  }, [appInfo])

  return (
    <div className="app-details">
      <Tabs className="deveTab" placement='left' style={{ background: "transparent" }}>
        <TabPanel value={11} label='SDK管理' >
          <Button style={{ margin: '10px' }} onClick={() => onSwitchChange(true)} >刷新应用信息到SDK</Button>
          <FlexDescLine
            className="fields"
            title="是否开启服务器SDK"
            value={appInfo.name}
            fieldName='name'
            valueRender={() => <Switch size="large" value={ifDebug ? true : false} onChange={onSwitchChange} label={['开启', '关闭']} />}
            confirmValue={confirmValue}
          />
          <FlexDescLine
            className="fields"
            title="Token"
            value={appInfo.name}
            fieldName='name'
            confirmValue={confirmValue}
          />
        </TabPanel>
        <TabPanel value={12} label='密钥管理' >
          <FlexDescLine
            className="fields"
            title="安全公钥"
            value={appInfo.name}
            fieldName='name'
            confirmValue={confirmValue}
          />
          <FlexDescLine
            className="fields"
            title="安全私钥"
            value={appInfo.name}
            fieldName='name'
            confirmValue={confirmValue}
          />
        </TabPanel>
        <TabPanel value={13} label='可见性管理' >
          <FlexDescLine
            className="fields"
            title="是否限制使用范围"
            value={appInfo.name}
            fieldName='name'
            valueRender={() => <Switch size="large" value={ifVisible ? true : false} onChange={(v) => { setIfvisible(v) }} label={['是', '否']} />}
            confirmValue={confirmValue}
            disabled
          />
          {ifVisible && <FlexDescLine
            className="fields"
            title="限制类型"
            value={appInfo.name}
            fieldName='name'
            valueRender={() => <Select style={styles} onChange={(v: any) => setSelect(v)} options={personEnum} />}
            confirmValue={confirmValue}
            disabled
          />
          }
          {ifVisible && (select === 'person' || select === 'all') &&
            <FlexDescLine
              className="fields"
              title="可以使用的人员"
              value={appInfo.name}
              fieldName='name'
              valueRender={() => <Select style={styles} onChange={(v: any) => setSelect(v)} options={personEnum} />}
              confirmValue={confirmValue}
              disabled
            />}
          {ifVisible && (select === 'org' || select === 'all') &&
            <FlexDescLine
              className="fields"
              title="可以使用的机构"
              value={appInfo.name}
              fieldName='name'
              valueRender={() => <Select style={styles} onChange={(v: any) => setSelect(v)} options={personEnum} />}
              confirmValue={confirmValue}
              disabled
            />}
        </TabPanel>
      </Tabs>
    </div>
  )
}