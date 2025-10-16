import * as yup from "yup";

export const quizSchema = yup.object({
  id: yup.string(),
  question: yup.string().required("Question is required"),
  state: yup.string().required("Status is required"),
  correctAnswerIndex: yup.number().required("CorrectAnswerIndex is required"),
  explanation: yup.string().nullable(),
  options: yup.array().of(
    yup.string().required("Option must be string"))
    .required("Options là bắt buộc")
    .min(1, "Min 1 option"),
});
