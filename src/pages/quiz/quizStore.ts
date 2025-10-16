import {makeAutoObservable} from "mobx"
import quizService from "./quizService.ts";
import toastUtil from "@/lib/toastUtil.ts";

export interface DataList {
  id: string;
  question: string,
  falseAnswers: string[],
  trueAnswer: string,
  state: string
}

export interface DataRequest {
  id: string;
  question: string,
  options: string[],
  correctAnswerIndex: number,
  explanation: string,
  state: string
}

class QuizStore {
  isLoading: boolean = false
  isLoadingGet: boolean = false
  isLoadingBt: boolean = false
  isOk: boolean = false
  page: number = 0
  size: number = 10
  totalPages: number = 0
  searchKey: string = ""
  id: string = ""
  errors: any = []
  lists: DataList[] = []
  dataRequest: DataRequest = {
    id: '',
    question: '',
    options: [],
    correctAnswerIndex: 0,
    explanation: '',
    state: '',
  }
  
  constructor() {
    makeAutoObservable(this)
  }
  
  clearState = () => {
    this.dataRequest = {
      id: '',
      question: '',
      options: [],
      correctAnswerIndex: 0,
      explanation: '',
      state: '',
    }
    this.errors = []
    this.searchKey = ""
  }
  
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
    this.isLoading = true
    const response = await quizService.getList()
    this.isLoading = false
    
    if (response.success) {
      this.lists = response.data.data
      this.totalPages = response.data.metadata.totalPages
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  getDetail = async (id: string) => {
    this.clearState()
    this.isLoadingGet = true
    const response = await quizService.getDetail(id)
    this.isLoadingGet = false
    
    if (response.success) {
      this.dataRequest = response.data
    } else {
      toastUtil.error(response.message || "Failed to fetch")
    }
  }
  
  create = async () => {
    await this.handleRequest(() => quizService.create(this.dataRequest), "Created", true);
  }
  
  update = async () => {
    await this.handleRequest(() => quizService.update(this.dataRequest.id, this.dataRequest), "Updated", true);
  }
  
  delete = async () =>
    this.handleRequest(() => quizService.delete(this.id), "Deleted", true);
}

const quizStore = new QuizStore()
export const useQuizStore = () => quizStore

export {QuizStore}
export default quizStore
