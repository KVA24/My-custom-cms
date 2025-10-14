import * as yup from "yup";

export const budgetSchema = yup.object({
  id: yup.string(),
  name: yup.string().required("Name is required"),
  value: yup.number().required("Value is required"),
});

export const budgetAmountSchema = yup.object({
  id: yup.string(),
  amount: yup.number().required("Amount is required"),
  action: yup.string().required("Action is required"),
});
