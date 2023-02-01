import classNames from "classnames";
import { useMemo } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { FC } from "react";
import { CheckIcon, CloseIcon, EditIcon } from "tdesign-icons-react";
import { Input } from "tdesign-react";
import "./index.scss";

export interface TempStoreOperation<T> {
  currentValue: T;
  update(val: T): void;
}

export interface FlexDescLineProps<T> {
  title: string;
  value: T;
  valPosition?: "default" | "newLine";
  className?: string;
  valueRender?(
    val: string,
    readonly: boolean,
    tempStore?: TempStoreOperation<T>
  ): React.ReactNode;
  /**
   * 字段名称
   */
  fieldName?: string;
  /**
   * value变更
   * @param val 变更之后的value
   */
  confirmValue?(val: T, fieldName?: string): void;
  /**
   * 禁止
   */
  disabled?: boolean;
}

function defaultValueRender(
  value: any,
  readonly: boolean,
  tmpStoreObj: TempStoreOperation<any>
): React.ReactNode {
  if (readonly) {
    return (
      <div
        title={value}
        style={{ textAlign: "right", color: "#888", width: "100%" }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              width: 0,
              flex: 1,
            }}
          >
            {value}
          </span>
        </div>
      </div>
    );
  } else {
    return (
      <Input
        align="right"
        onChange={tmpStoreObj.update}
        value={tmpStoreObj.currentValue}
      />
    );
  }
}

export const FlexDescLine: FC<FlexDescLineProps<any>> = ({
  title,
  value,
  valPosition = "default",
  valueRender,
  confirmValue,
  disabled,
  className,
  fieldName
}) => {
  const [tmpStoreValue, setTmpStoreValue] = useState<any>(undefined);

  const [readonly, setReadonly] = useState<boolean>(true);

  const tmpStoreObj = useMemo<TempStoreOperation<any> | undefined>(() => {
    if (readonly) {
      return undefined;
    }

    return {
      currentValue: tmpStoreValue,
      update(val) {
        setTmpStoreValue(val);
      },
    };
  }, [readonly, tmpStoreValue]);

  const valueElement = useMemo(() => {
    const render = valueRender || defaultValueRender;
    return render(value, readonly, tmpStoreObj);
  }, [readonly, tmpStoreObj, value, valueRender]);

  const editClick = useCallback(() => {
    setTmpStoreValue(value);
    setReadonly(false);
  }, [value]);

  const cancelClick = useCallback(() => {
    setTmpStoreValue(undefined);
    setReadonly(true);
  }, []);

  const okClick = useCallback(() => {
    confirmValue && confirmValue(tmpStoreValue, fieldName);
    setReadonly(true);
  }, [confirmValue, tmpStoreValue, fieldName]);

  return (
    <div className={classNames("flex-desc-line", className)}>
      <div className="first-line">
        <div className="title">
          <span>{title}</span>
        </div>
        <div className="value">{valPosition === "default" && valueElement}</div>
        <div className="operation">
          {disabled ? (
            <></>
          ) : readonly ? (
            <EditIcon onClick={editClick} className="btn" />
          ) : (
            <>
              <CheckIcon onClick={okClick} className="btn" />
              &nbsp;&nbsp;&nbsp;&nbsp;
              <CloseIcon onClick={cancelClick} className="btn" />
            </>
          )}
        </div>
      </div>
      {valPosition === "newLine" && (
        <div className="second-line">{valueElement}</div>
      )}
    </div>
  );
};
