import { current, db, IconType, id } from "@teamworktoolbox/sdk";
import classNames from "classnames";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useCallback } from "react";
import { ErrorCircleFilledIcon } from "tdesign-icons-react";
import {
  Button,
  Dialog,
  Form,
  Input,
  message,
  Radio,
  SubmitContext,
} from "tdesign-react";
import useForm from "tdesign-react/es/form/hooks/useForm";
import { GlobalDataContext } from "../../App";
import { Avatar } from "../../components/Avatar";
import { Tooltip } from "../../components/Tooltip";
import { tryCatchFinally } from "../../tools";
import { DbDataType, ProjectInfo } from "../../types";

/**
 * 使用项目列表
 * @returns [项目列表, 刷新项目列表]
 */
export function useProjectList(): [ProjectInfo[], () => void] {
  const [projectInfoList, setProjectInfoList] = useState<ProjectInfo[]>([]);
  const refreshProjectList = useCallback(async () => {
    try {
      setProjectInfoList(
        (
          await db.index.find<ProjectInfo>({
            selector: {
              "indexInfo.dataType": DbDataType.PROJECT_INFO,
              "indexInfo.createAt": { $gte: null },
              "indexInfo.sorted": { $gte: null },
            },
            sort: [
              {
                "indexInfo.sorted": "asc",
              },
            ],
          })
        ).docs
      );
    } catch (e) {
      message.error(
        "查询项目列表失败: " +
          ((e as Error).message || (typeof e === "string" && e) || "未知的错误")
      );
    }
  }, []);

  useEffect(() => {
    refreshProjectList();
  }, [refreshProjectList]);

  return [projectInfoList, refreshProjectList];
}

export interface ProjectPopupOperation {
  show(): void;
  hide(): void;
}

const defaultAppIconUrl = "https://127.0.0.1:65528/icons/undefined.png";

export function useProjectAdd(
  confirmCallback?: (projectInfo: ProjectInfo) => void
): [React.ReactNode, ProjectPopupOperation] {
  const globalData = useContext(GlobalDataContext);

  const [form] = useForm();

  const { showLoading, hideLoading } = globalData;
  const [iconUrl, setIconUrl] = useState<string>(defaultAppIconUrl);

  const [show, setShow] = useState<boolean>(false);

  const iconChange = useCallback((canvas: HTMLCanvasElement) => {
    setIconUrl(canvas.toDataURL("image/png"));
  }, []);

  const operation: ProjectPopupOperation = useMemo(() => {
    return {
      show() {
        setShow(true);
      },
      hide() {
        setShow(false);
      },
    };
  }, []);

  const formSubmit = useCallback(
    async (ctx: SubmitContext) => {
      if (ctx.validateResult !== true) {
        return;
      }
      showLoading("正在创建项目...");

      await tryCatchFinally(
        async () => {
          const uniqueId = await id.unique();
          const projectInfo = {
            _id: uniqueId,
            appInfo: {
              id: uniqueId,
              name: form.getFieldValue("name"),
              icon: iconUrl,
              iconType: IconType.URL,
              shortDesc: form.getFieldValue("shortDesc"),
              type: form.getFieldValue("type"),
              authId: current.userInfo.id,
              authorInfo: current.userInfo,
            },
            indexInfo: {
              createAt: new Date(),
              dataType: DbDataType.PROJECT_INFO,
              sorted: await id.seq(),
            },
          } as ProjectInfo;

          await db.put(projectInfo);
          confirmCallback?.(projectInfo);
          setIconUrl(defaultAppIconUrl);
          operation.hide();
        },
        () => {
          hideLoading();
        }
      );
    },
    [confirmCallback, form, hideLoading, iconUrl, operation, showLoading]
  );

  return [
    <div className={classNames("project-add-popup", { show })}>
      <div className="form-wrapper">
        {show && (
          <Form
            onSubmit={formSubmit}
            form={form}
            rules={{
              name: [
                { required: true },
                { max: 20, message: "项目名称最多只支持20个字符" },
                {
                  validator: async (val) => {
                    if (!val) {
                      return true;
                    }
                    const currentDocs = await db.index.find({
                      selector: {
                        "appInfo.name": val,
                      },
                    });
                    return currentDocs.docs.length === 0;
                  },
                  message: "项目名称已存在",
                  trigger: "blur",
                },
              ],
              shortDesc: [
                { required: true },
                { max: 100, message: "短描述最多只支持100个字符" },
              ],
            }}
            labelAlign="left"
            layout="vertical"
            preventSubmitDefault
            resetType="initial"
            statusIcon
            labelWidth={168}
            initialData={{ type: 0 }}
          >
            <Form.FormItem label="图标">
              <Avatar image={iconUrl} onImageChange={iconChange} />
            </Form.FormItem>
            <Form.FormItem label="项目名称" name="name">
              <Input placeholder="请输入项目名称, 最多20个字符" />
            </Form.FormItem>
            <Form.FormItem label="项目简述" name="shortDesc">
              <Input />
            </Form.FormItem>
            <Form.FormItem label={"项目类型( 后期不可更改 )"} name="type">
              <Radio.Group>
                <Radio value={0}>
                  <Tooltip content="离线的web部署包, 支持更加丰富的api与插件">
                    本地资源包
                  </Tooltip>
                </Radio>
                <Radio value={1}>
                  <Tooltip content="只需要远程的web站点地址, api受限, 只支持桌面模式">
                    远程WEB站点
                  </Tooltip>
                </Radio>
              </Radio.Group>
            </Form.FormItem>
            <Form.FormItem style={{ marginLeft: 168 }}>
              <Button
                onClick={() => {
                  // form.reset();
                  setIconUrl(defaultAppIconUrl);
                  setShow(false);
                }}
                theme="default"
                variant="base"
                style={{ marginRight: 10 }}
              >
                取消
              </Button>
              <Button
                theme="primary"
                variant="base"
                type="submit"
                style={{ marginRight: 10 }}
              >
                提交
              </Button>
            </Form.FormItem>
          </Form>
        )}
      </div>
    </div>,
    operation,
  ];
}

const activeProjectDbKey = "active_project";
export function useProjectActive(): [
  ProjectInfo | undefined,
  (projectInfo: ProjectInfo) => Promise<void>
] {
  const [activeProjectInfo, setActiveProjectInfo] = useState<
    ProjectInfo | undefined
  >(undefined);

  const queryActiveProjectInfo = useCallback(async () => {
    try {
      setActiveProjectInfo(await db.get(activeProjectDbKey));
    } catch (e) {
      setActiveProjectInfo(undefined);
    }
  }, []);

  useEffect(() => {
    queryActiveProjectInfo();
  }, [queryActiveProjectInfo]);

  const switchActiveProject = useCallback(async (projectInfo: ProjectInfo) => {
    try {
      await db.remove(activeProjectDbKey);
    } catch (e) {}

    const activeProject: ProjectInfo = {
      ...projectInfo,
      _id: activeProjectDbKey,
      _rev: undefined,
    };

    delete (activeProject.indexInfo as any)["dataType"];
    await db.put(activeProject);
    setActiveProjectInfo(activeProject);
  }, []);

  return [activeProjectInfo, switchActiveProject];
}

export function useProjectActiveDialog(
  callback?: (projectInfo: ProjectInfo) => void
): [React.ReactNode, (projectInfo: ProjectInfo) => void] {
  const [isEndConfirm, setIsEndConfirm] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [confirmInputVal, setConfirmInputVal] = useState<string>("");
  const [activeProjectInfo, setActiveProjectInfo] = useState<
    ProjectInfo | undefined
  >(undefined);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  const cancel = useCallback(() => {
    setIsEndConfirm(false);
    setShowDialog(false);
    setActiveProjectInfo(undefined);
    setConfirmLoading(false);
  }, []);

  return [
    useMemo(() => {
      if (!showDialog) {
        return <></>;
      }

      if (!isEndConfirm) {
        return (
          <Dialog
            header={
              <>
                <ErrorCircleFilledIcon style={{ color: "#ED7B2F" }} />
                <span>此操不可恢复，请您确认是否一定要进行删除</span>
              </>
            }
            visible
            cancelBtn={{
              theme: "success",
              children: "取消",
            }}
            confirmBtn={{
              theme: "danger",
              children: "确认",
            }}
            closeBtn={<></>}
            closeOnEscKeydown={false}
            closeOnOverlayClick={false}
            onCancel={cancel}
            onConfirm={() => {
              setIsEndConfirm(true);
            }}
          />
        );
      }
      return (
        <Dialog
          header={
            <>
              <ErrorCircleFilledIcon style={{ color: "#ED7B2F" }} />
              <span>将本项目的名称输入至下方的文本框， 以确认用来删除</span>
            </>
          }
          closeBtn={<></>}
          closeOnEscKeydown={false}
          closeOnOverlayClick={false}
          visible
          cancelBtn={{
            theme: "success",
            children: "取消",
            disabled: confirmLoading,
          }}
          confirmBtn={{
            theme: "danger",
            children: "确认",
            disabled: confirmInputVal !== activeProjectInfo?.appInfo.name,
            loading: confirmLoading,
          }}
          onCancel={cancel}
          onConfirm={async () => {
            tryCatchFinally(
              async () => {
                if (!activeProjectInfo) {
                  throw new Error("当前项目不能为空");
                }

                setConfirmLoading(true);

                let id = activeProjectInfo._id;

                if (id === activeProjectDbKey) {
                  await db.remove(activeProjectDbKey);
                  id = activeProjectInfo.appInfo.id;
                }

                await db.remove(id);
                callback && callback(activeProjectInfo!);
                cancel();
              },
              () => {
                setConfirmLoading(false);
              }
            );
          }}
        >
          <Input
            onChange={async (val) => {
              setConfirmInputVal(val);
            }}
            placeholder="请输入当前项目的名称"
          />
        </Dialog>
      );
    }, [
      activeProjectInfo,
      callback,
      cancel,
      confirmInputVal,
      confirmLoading,
      isEndConfirm,
      showDialog,
    ]),

    useCallback((projectInfo) => {
      setActiveProjectInfo(projectInfo);
      setIsEndConfirm(false);
      setShowDialog(true);
    }, []),
  ];
}
