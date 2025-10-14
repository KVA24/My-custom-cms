import * as yup from "yup";

export const poolSchema = yup.object({
  id: yup.string(),
  poolBudgetId: yup.string(),
  code: yup.string().required("Name is required"),
  fallbackPoolId: yup.string().nullable(),
  state: yup.string().required("Status is required"),
  rewardMaps: yup.array().of(
    yup.object({
      rewardId: yup.string(),
      weight: yup.number(),
      periodType: yup
        .string()
        .when("isUnlimited", {
          is: false,
          then: (schema) => schema.required("Period type is required"),
          otherwise: (schema) => schema.notRequired().nullable(),
        }),
      isActivate: yup.boolean(),
      isUnlimited: yup.boolean(),
      poolRewardSchedules: yup.array().of(
        yup.object({
          poolRewardMapId: yup.string(),
          periodType: yup.string(),
          startAt: yup.string(),
          endAt: yup.string(),
          quantity: yup.number(),
          state: yup.string(),
        })
      )
    })
  ).min(1, "Reward is required").required("Reward is required"),
});
