import React from "react";
import {Bounce, toast, ToastContent, ToastOptions} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const baseConfig: ToastOptions = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
  transition: Bounce,
  closeButton: false,
};

export function DefaultToast(props: { title: string; message?: string }) {
  return React.createElement(
    "div",
    {className: "flex flex-col"},
    React.createElement("strong", {className: "text-sm font-medium"}, props.title),
    props.message && React.createElement("span", {className: "text-xs text-gray-600"}, props.message)
  );
}

class ToastUtil {
  info(content: string | ToastContent, id?: string) {
    this.showToast("info", content, id);
  }
  
  success(content: string | ToastContent, id?: string) {
    this.showToast("success", content, id);
  }
  
  warning(content: string | ToastContent, id?: string) {
    this.showToast("warning", content, id);
  }
  
  error(content?: string | ToastContent, id?: string) {
    this.showToast("error", content ?? "Đã có lỗi xảy ra!", id);
  }
  
  private showToast(
    type: "info" | "success" | "warning" | "error",
    content: string | ToastContent,
    id?: string
  ) {
    const finalContent: ToastContent =
      typeof content === "string"
        ? React.createElement(DefaultToast, {
          title: this.getTitle(type),
          message: content,
        })
        : content;
    
    switch (type) {
      case "info":
        toast.info(finalContent, {...baseConfig, toastId: id});
        break;
      case "success":
        toast.success(finalContent, {...baseConfig, toastId: id});
        break;
      case "warning":
        toast.warn(finalContent, {...baseConfig, toastId: id});
        break;
      case "error":
        toast.error(finalContent, {...baseConfig, toastId: id});
        break;
    }
  }
  
  private getTitle(type: "info" | "success" | "warning" | "error") {
    switch (type) {
      case "info":
        return "Info";
      case "success":
        return "Success";
      case "warning":
        return "Warning";
      case "error":
        return "Error";
    }
  }
}

export const toastUtil = new ToastUtil();
export default toastUtil;