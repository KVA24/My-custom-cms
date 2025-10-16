import * as yup from "yup";

export const questDtoSchema = yup.object({
  id: yup.number().required("Quest ID is required"),
  eventId: yup.number().required("Event ID is required"),
  periodValue: yup.number().required("Period value is required"),
  periodUnit: yup.string().required("Period unit is required"),
  minCount: yup.number().required("Min count is required"),
  maxCount: yup.number().required("Max count is required"),
  continuous: yup.boolean().required("Continuous flag is required"),
  aggregateType: yup.string().required("Aggregate type is required"),
});

export const taskSchema = yup.object({
  id: yup.string().nullable(),
  name: yup.string().required("Name is required"),
  startDate: yup
    .string()
    .nullable()
    .required("Start date is required"),
  endDate: yup
    .string()
    .nullable()
    .when("isNoEndDate", {
      is: false,
      then: (schema) =>
        schema
          .required("End date is required")
          .test(
            "endDate-after-startDate",
            "End date must be greater than or equal to start date",
            function (endDate) {
              const {startDate} = this.parent;
              if (!startDate || !endDate) return true;
              return endDate >= startDate;
            }
          ),
      otherwise: (schema) => schema.nullable(),
    }),
  isNoEndDate: yup.boolean().required(),
  periodValue: yup.number().required("Period value is required"),
  periodUnit: yup.string().required("Period unit is required"),
  taskCategory: yup.string().nullable(),
  isRecurring: yup.boolean().required(),
  rewardAmount: yup.number().nullable(),
  questDtos: yup
    .array()
    .of(questDtoSchema)
    .min(1, "At least one quest is required")
    .required("Quest list is required"),
  slidingType: yup.string().nullable(),
  deepLink: yup.string().nullable(),
  description: yup.string().nullable(),
  position: yup.number().typeError("Position must be a number").nullable(),
  imageId: yup.string().nullable(),
  otpCode: yup.string().required("OTP code is required"),
  state: yup.string().nullable(),
});