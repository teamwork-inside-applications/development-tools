import { AppInfo } from "@teamworktoolbox/sdk";

/**
 * 全局上下文数据
 */
export interface GlobalData {
  showLoading(text?: string): void;
  hideLoading(): void;
}

/**
 * 项目信息
 */
export interface ProjectInfo {
  _rev?: string;
  _id: string;
  appInfo: AppInfo;
  indexInfo: {
    createAt: Date;
    dataType: DbDataType;
    sorted: number;
  };
}

export interface LoadingInfo {
  loading: boolean;
  text?: string;
}

export enum DbDataType {
  PROJECT_INFO = "projectInfo",
}
