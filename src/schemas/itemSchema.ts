import * as yup from "yup";

const validTypes = [
  "DIAMOND",
  "TURN_FREE",
  "TURN_PAID",
  "HAMMER",
  "MIX",
  "MB",
  "JACKFRUIT",
  "POINT",
  "JACKPOT",
] as const;

const validSourceTypes = ["EXTERNAL", "GAME"] as const;

const storeType = ["KS", "DIAMOND"] as const;

export const itemSchema = yup.object({
  id: yup.string(),
  code: yup.string().required("Code is required"),
  name: yup.string().required("Name is required"),
  type: yup
    .string()
    .test("required-or-valid", function (this: yup.TestContext, value) {
      if (!value || value === "") {
        return this.createError({message: "Type is required"});
      }
      if (!validTypes.includes(value as any)) {
        return this.createError({message: "Invalid type"});
      }
      return true;
    }),
  
  sourceType: yup
    .string()
    .test("required-or-valid", function (this: yup.TestContext, value) {
      if (!value || value === "") {
        return this.createError({message: "SourceType is required"});
      }
      if (!validSourceTypes.includes(value as any)) {
        return this.createError({message: "Invalid sourceType"});
      }
      return true;
    }),
  
  convertRate: yup
    .number()
    .typeError("ConvertRate must be a number")
    .required("ConvertRate is required"),
});

export const storeSchema = yup.object({
  id: yup.string(),
  poolBudgetId: yup.string().required("Pool budget is required"),
  name: yup.string().required("Name is required"),
  serviceId: yup.string().required("ServiceId is required"),
  state: yup.string().required("Status is required"),
  type: yup
    .string()
    .test("required-or-valid", function (this: yup.TestContext, value) {
      if (!value || value === "") {
        return this.createError({message: "Type is required"});
      }
      if (!storeType.includes(value as any)) {
        return this.createError({message: "Invalid type"});
      }
      return true;
    }),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  convertedPrice: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  displayOrder: yup
    .number()
    .typeError("DisplayOrder must be a number")
    .required("DisplayOrder is required"),
  items: yup.array().of(
    yup.object({
      itemId: yup.string(),
      quantity: yup.number(),
      unitPrice: yup.number(),
      displayOrder: yup.number(),
    })
  ).required("Items is required"),
});
