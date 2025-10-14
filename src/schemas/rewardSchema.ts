import * as yup from "yup";

export const rewardSchema = yup.object({
  id: yup.string(),
  rewardName: yup.string().required("Name is required"),
  externalId: yup.string(),
  value: yup.number().required("Value is required"),
  valueConverted: yup.number().required("Value Converted is required"),
  type: yup.string().required("Type is required"),
  imageId: yup.string().required("ImageId is required"),
  isDefault: yup.boolean(),
  itemId: yup.string().required("Item is required"),
  // itemCode: yup.number().required("Item is required"),
});
