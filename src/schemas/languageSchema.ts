import * as yup from "yup";

export const languageSchema = yup.object({
  id: yup.string(),
  name: yup.string().required("Name is required"),
  code: yup.string().required("Code is required"),
  iconUrl: yup.string().required("Icon is required"),
  sort: yup.number().nullable(),
  state: yup.string().required("Status is required"),
});
