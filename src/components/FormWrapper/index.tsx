import React, { FC, useCallback, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Data,
  Form,
  FormInstanceFunctions,
  FormRule,
  message,
  SubmitContext,
} from "tdesign-react";
import { GlobalDataContext } from "../../App";

export interface FormItem {
  label: string;
  name: string;
  children: React.ReactNode;
  initData?: any;
}

export interface FormWrapperProps {
  formDataRules: { [key: string]: Array<FormRule> };
  formInitData: any;
  formItemList: FormItem[];
  loadingText: string;
  prevBtnTo?: string;
  submitBreakTo?: string;
  onSubmit?(
    form: FormInstanceFunctions<Data>,
    ctx: SubmitContext
  ): void | Promise<void>;
}

export const FormWrapper: FC<FormWrapperProps> = ({
  formDataRules,
  formInitData,
  loadingText,
  formItemList,
  prevBtnTo,
  onSubmit,
  submitBreakTo,
}) => {
  const globalData = useContext(GlobalDataContext);
  const { showLoading, hideLoading } = globalData;

  const navigate = useNavigate();
  const [form] = Form.useForm();
  const formSubmit = useCallback(
    async (context: SubmitContext) => {
      if (context.validateResult !== true) {
        return;
      }

      showLoading(loadingText);
      try {
        if (onSubmit) {
          const res = onSubmit(form, context);
          if (res instanceof Promise) {
            await res;
          }
          submitBreakTo && navigate(submitBreakTo, { replace: true });
        }
      } catch (e) {
        if (typeof e === "string") {
          message.error(e);
        } else {
          message.error("未知的异常信息");
        }
      } finally {
        hideLoading();
      }
    },
    [
      form,
      hideLoading,
      loadingText,
      navigate,
      onSubmit,
      showLoading,
      submitBreakTo,
    ]
  );

  const prevBtnClick = useCallback(() => {
    if (!prevBtnTo) {
      return;
    }
    navigate(prevBtnTo, { replace: true });
  }, [navigate, prevBtnTo]);

  const formItemElements = useMemo(() => {
    return formItemList.map((f) => {
      return (
        <Form.FormItem
          initialData={f.initData}
          label={f.label}
          name={f.name}
          key={f.name}
        >
          {f.children}
        </Form.FormItem>
      );
    });
  }, [formItemList]);

  useEffect(() => {
    if (!form) {
      return;
    }

    form.setFieldsValue?.(formInitData);
  }, [form, formInitData]);

  return (
    <>
      <Form
        form={form}
        colon
        labelAlign="left"
        layout="vertical"
        preventSubmitDefault
        resetType="initial"
        statusIcon
        labelWidth={128}
        rules={formDataRules}
        initialData={formInitData}
        onSubmit={formSubmit}
      >
        {formItemElements}
        <div style={{ marginTop: "28px" }}>
          {prevBtnTo && (
            <Button
              onClick={prevBtnClick}
              theme="default"
              style={{ float: "left" }}
            >
              取消
            </Button>
          )}
          <Button type="submit" style={{ float: "right" }}>
            确认
          </Button>
        </div>
      </Form>
    </>
  );
};
