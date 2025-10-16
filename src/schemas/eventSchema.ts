import * as yup from "yup";

export const eventSchema = yup.object({
  id: yup.string(),
  name: yup.string().required("Name is required"),
  externalId: yup.string().nullable(),
  state: yup.string().required("Status is required"),
  parameterized: yup.boolean(),
  eventParams: yup.array().of(
    yup.object({
      name: yup.string(),
      externalId: yup.number(),
      dataType: yup.boolean(),
      operator: yup.boolean(),
      value: yup.boolean(),
    })
  ).when("parameterized", {
    is: true,
    then: (schema) =>
      schema.min(1, "Param is required").required("Param is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
