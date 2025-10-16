import {makeAutoObservable} from "mobx";
import accountService from "./accountService.ts";
import toastUtil from "@/lib/toastUtil.ts";

export interface DataRequest {
  id: string;
  username: string;
  password: string;
  oldPassword: string;
  newPassword: string;
  role: string;
  state: string;
  otpCode: string;
}

class AccountStore {
  isLoading = false;
  isLoadingGet = false;
  isLoadingQr = false;
  isLoadingBt = false;
  isOk = false;
  page = 0;
  size = 10;
  totalPages = 0;
  searchKey = "";
  id = "";
  errors: any = {};
  lists: DataRequest[] = [];
  dataRequest: DataRequest = {
    id: "",
    username: "",
    password: "",
    role: "",
    state: "",
    oldPassword: "",
    newPassword: "",
    otpCode: "",
  };
  qrCode = "";
  otpCode = ""
  listRole: { value: string, label: string }[] = [
    {value: "ADMIN", label: "Admin"},
    {value: "OPERATOR", label: "Operator"},
    {value: "CC", label: "CC"}
  ];
  
  constructor() {
    makeAutoObservable(this);
  }
  
  clearState = () => {
    this.dataRequest = {
      id: "",
      username: "",
      password: "",
      role: "",
      state: "",
      oldPassword: "",
      newPassword: "",
      otpCode: "",
    };
    this.errors = [];
    this.qrCode = "";
    this.otpCode = "";
    this.isOk = false;
    this.searchKey = "";
  };
  
  private async handleRequest(
    fn: () => Promise<any>,
    successMessage: string,
    refreshList: boolean = false
  ): Promise<any> {
    this.isOk = false;
    this.isLoadingBt = true;
    try {
      const response = await fn();
      if (response.success) {
        toastUtil.success(successMessage);
        this.isOk = true;
        if (refreshList) {
          this.getList().then();
        }
        return response;
      } else {
        throw new Error(response.message || successMessage + " failed");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Unexpected error";
      toastUtil.error(errorMessage);
      return {success: false, error: errorMessage};
    } finally {
      this.isLoadingBt = false;
    }
  }
  
  getList = async () => {
    this.isLoading = true;
    const response = await accountService.getList();
    this.isLoading = false;
    
    if (response.success) {
      this.lists = response.data.data;
      this.totalPages = response.data.metadata.totalPages;
    } else {
      toastUtil.error(response.message || "Failed to fetch");
    }
  };
  
  getDetail = async (id: string) => {
    this.clearState();
    this.isLoadingGet = true;
    const response = await accountService.getDetail(id);
    this.isLoadingGet = false;
    
    if (response.success) {
      this.dataRequest = response.data;
    } else {
      toastUtil.error(response.message || "Failed to fetch");
    }
  };
  
  getQr = async (id: string) => {
    this.isLoadingQr = true;
    const response = await accountService.genQr(id);
    this.isLoadingQr = false;
    
    if (response.success) {
      this.qrCode = response.data;
    } else {
      toastUtil.error(response.message || "Failed to fetch");
    }
  };
  
  create = async (sign?: any) =>
    this.handleRequest(
      () => accountService.create(this.dataRequest, sign),
      "Created",
      true
    );
  
  update = async (sign?: any) =>
    this.handleRequest(
      () => accountService.update(this.dataRequest.id, this.dataRequest, sign),
      "Updated",
      true
    );
  
  delete = async (sign?: any) =>
    this.handleRequest(() => accountService.delete(this.id, sign, this.otpCode), "Deleted", true);
}

const accountStore = new AccountStore();
export const useAuthStore = () => accountStore;

export {AccountStore};
export default accountStore;
