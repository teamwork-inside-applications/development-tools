import { AppType, db, dialog, id } from "@teamworktoolbox/sdk";
import dayjs from "dayjs";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import { FlexDescLine, TempStoreOperation } from "../../../../../../../../components/FlexDescLine";
import { ProjectInfo } from "../../../../../../../../types";
import { Swiper, Upload, Space, MessagePlugin, Image, ImageViewer, Button } from 'tdesign-react';
import '../index.scss'
import { blobToBase64 } from "../../../../../../../../tools/common";
import { tryCatchFinally } from "../../../../../../../../tools";
import { AddIcon } from "tdesign-icons-react";

const { SwiperItem } = Swiper;
const imgs = "https://tdesign.gtimg.com/demo/demo-image-1.png"

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


  const onChange = useCallback(async (temp: TempStoreOperation<string[]>) => {
    const picPath = dialog.showOpenDialog({ title: '上传图片', filters: [{ name: "图片", extensions: ['png', 'jpg', 'jpeg'] }] })
    if (!picPath) { return }
    const _id = await id.unique()
    await tryCatchFinally(async () => {
      await db.putAttachmentByLocalFilepath(_id, picPath[0])
      const imageBlob = await db.getAttachmentToBlob(_id)
      const imageBase64 = await blobToBase64(imageBlob)
      temp.update([...temp.currentValue, imageBase64])
    }, async () => {
      await db.removeAttachment(_id)
    })
  }, [])


  const showPic = useCallback((_value: any, readonly: boolean, tempStore: TempStoreOperation<string[]>) => {
    const value = _value as string[];

    if (readonly) {
      return <Swiper animation="slide" interval={2000}>
        <SwiperItem>
          <ImageViewer trigger={({ onOpen }) => <img onClick={onOpen} height={300} src={imgs} />} images={[imgs]} />
        </SwiperItem>
      </Swiper>
    }
    return <div style={{ display: "flex", flexDirection: 'row', flexWrap: "wrap", marginBottom: 30,padding:'0 15px' }}>
      {tempStore.currentValue && tempStore.currentValue.map(item => <ImageViewer  trigger={({ onOpen }) => <img style={{ marginBottom: 20, marginRight: 20 }} onClick={onOpen} height={80} src={item} />} images={[item]} />)}
      {(tempStore.currentValue || []).length < 9 && <Button title="点击添加展示图" style={{height:80,width:80}} onClick={() => { onChange(tempStore) }} shape="square" variant="base">
          <AddIcon size={40}/>
        </Button>}
    </div>
  }, [])

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
      <FlexDescLine
        className="fields"
        title="展示图"
        valueRender={showPic}
        confirmValue={(...value)=>{console.log(value)}}
        value={[]}
        valPosition='newLine' />
    </div>
  );
};
