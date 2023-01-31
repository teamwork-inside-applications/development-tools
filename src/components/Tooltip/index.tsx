import { FC } from "react";
import { InfoCircleFilledIcon } from "tdesign-icons-react";
import {
  Tooltip as TDTooltip,
  TooltipProps as TDTooltipProps,
} from "tdesign-react";

export interface TooltipProps extends TDTooltipProps {}

export const Tooltip: FC<TooltipProps> = ({ children, ...allData }) => {
  return (
    <>
      {children}
      &nbsp;&nbsp;
      <TDTooltip {...allData}>
        <InfoCircleFilledIcon size="15px" />
      </TDTooltip>
    </>
  );
};
