import { AppType, dialog, fs } from "@teamworktoolbox/sdk";
import dayjs from "dayjs";
import { FC, useCallback, useContext, useMemo, useState } from "react";
import { FlexDescLine, TempStoreOperation } from "../../../../../../../../components/FlexDescLine";
import { ProjectInfo } from "../../../../../../../../types";
import { Swiper, ImageViewer, Button } from 'tdesign-react';
import '../index.scss'
import { AddIcon } from "tdesign-icons-react";
import BraftEditor, { EditorState } from "braft-editor";
import 'braft-editor/dist/index.css';
import 'braft-editor/dist/output.css'
import { ProjectContext } from "../../../../../..";
import { useProjectActiveUpdate } from "../../../../../../../../hooks";

const { SwiperItem } = Swiper;

export interface AppDetailsProps {
  activeProjectInfo: ProjectInfo;
}

export const AppDetails: FC<AppDetailsProps> = ({
  activeProjectInfo: { appInfo, indexInfo },
}) => {
  const { activeProjectInfo, refreshProjectList, switchActiveProject } = useContext(ProjectContext)
  const confirmValue = useProjectActiveUpdate(activeProjectInfo, refreshProjectList, switchActiveProject)
  const [braftValue, setBraftValue] = useState(BraftEditor.createEditorState(null))

  const appType = useMemo(() => {
    if (appInfo.type === AppType.REMOTE_WEB) {
      return "远程WEB站点";
    } else if (appInfo.type === AppType.LOCAL) {
      return "本地资源包";
    }
  }, [appInfo.type]);


  const onChange = useCallback(async (temp: TempStoreOperation<string[]>) => {
    const picPath = dialog.showOpenDialog({ title: '上传图片', filters: [{ name: "图片", extensions: ['png', 'jpg', 'jpeg'] }] })
    if (!picPath) { return }
    const imgBase64 = await fs.readFileToBase64Str(picPath[0])
    if (!temp.currentValue) {
      temp.update([imgBase64])
    }
    temp.update([...temp.currentValue, imgBase64])
  }, [])


  const showPic = useCallback((value: any, readonly: boolean, tempStore: TempStoreOperation<string[]>) => {
    if (readonly) {
      return <>
        {!value ? <h1 style={{ textAlign: "center", color: 'gray' }}> 请添加展示图 </h1> : <div style={{ padding: '15px', margin: "15px", backgroundColor: "#fff" }}>
          <Swiper animation="slide" interval={2000}>
            {
              value && value.map((m: any) => <SwiperItem>
                <ImageViewer trigger={({ onOpen }) => <img onClick={onOpen} height={100} src={m} />} images={[m]} />
              </SwiperItem>)
            }
          </Swiper>
        </div>
        }</>

    }
    return <div style={{ display: "flex", flexDirection: 'row', flexWrap: "wrap", padding: '0 15px' }}>
      {tempStore.currentValue && tempStore.currentValue.map(item => <ImageViewer trigger={({ onOpen }) => <img style={{ marginBottom: 20, marginRight: 20 }} onClick={onOpen} height={80} src={item} />} images={[item]} />)}
      {(tempStore.currentValue || []).length < 9 && <Button title="点击添加展示图" style={{ height: 80, width: 80 }} onClick={() => { onChange(tempStore) }} shape="square" variant='dashed'>
        <AddIcon size={40} />
      </Button>}
    </div>
  }, [])


  const onClickLongDesc = useCallback((editorState: EditorState, temp: TempStoreOperation<BraftEditor>) => {
    setBraftValue(editorState)
    temp.update(editorState.toHTML())
  }, [])

  const longdesc = useCallback((value: any, readonly: boolean, tempStore: TempStoreOperation<BraftEditor>) => {
    if (readonly) {
      return <>
        {!value ? <h1 style={{ textAlign: "center", color: 'gray' }}>请添加长描述</h1> :
          <div style={{ padding: '15px', margin: "15px", backgroundColor: '#fff' }} dangerouslySetInnerHTML={{ __html: value }} />}
      </>
    }
    return <BraftEditor
      value={braftValue}
      style={{ border: '1px solid #f0f0f0', margin: '0 15px', backgroundColor: '#fff' }}
      onChange={(editorState) => onClickLongDesc(editorState, tempStore)}
      onSave={confirmValue}
    />
  }, [braftValue])

  return (
    <div className="app-details">
      <FlexDescLine
        className="fields"
        title="名称"
        value={appInfo.name}
        fieldName='name'
        confirmValue={confirmValue}
      />
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
        fieldName='shortDesc'
        confirmValue={confirmValue}
      />
      <FlexDescLine
        className="fields"
        title="创建时间"
        value={dayjs(indexInfo.createAt).format("YYYY-MM-DD HH:mm:ss")}
        disabled
      />
      <FlexDescLine
        className="fields"
        title="展示图"
        valueRender={showPic}
        fieldName="slideshow"
        confirmValue={confirmValue}
        value={appInfo.slideshow}
        valPosition='newLine' />
      <FlexDescLine
        className="fields"
        title="长描述"
        valueRender={longdesc}
        fieldName='desc'
        confirmValue={confirmValue}
        value={appInfo.desc}
        valPosition='newLine' />
    </div>
  );
};
