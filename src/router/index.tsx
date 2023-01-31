import React from "react";
import { LayersIcon, TipsIcon } from "tdesign-icons-react";
import { TElement } from "tdesign-react/es/common";
import { Documents } from "../pages/Documents";
import { Projects } from "../pages/Projects";

/**
 * 路由信息
 */
export interface RouterInfo {
  /**
   * 标题
   */
  title: string;
  /**
   * 路径
   */
  path: string;
  /**
   * 元素
   */
  element: React.ReactNode;
  /**
   * 一级地址
   */
  firstOrderPath: string;
  /**
   * 图标
   */
  icon?: TElement;
}

const iconSize = "16px";

/**
 * 一级路由列表
 */
export const firstOrderRouterList: RouterInfo[] = [
  {
    title: "我的项目",
    path: "/projects/*",
    firstOrderPath: "/projects/",
    element: <Projects />,
    icon: <LayersIcon size={iconSize} />,
  },
  {
    title: "文档资源",
    path: "/documents/*",
    firstOrderPath: "/documents/",
    element: <Documents />,
    icon: <TipsIcon size={iconSize} />,
  },
];

export const NOT_FOUND_ROUTE_PATH = "/projects/index";
