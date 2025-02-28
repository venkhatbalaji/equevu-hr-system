import * as yup from "yup";

const minAgeDate = new Date();
minAgeDate.setFullYear(minAgeDate.getFullYear() - 18);

export const candidateSchema = yup.object({
  full_name: yup.string().required("Full name is required"),
  dob: yup
    .date()
    .typeError("Invalid date format")
    .max(minAgeDate, "You must be at least 18 years old"),
  experience: yup
    .number()
    .min(0, "Experience cannot be negative")
    .required("Experience is required"),
  department: yup
    .string()
    .oneOf(["IT", "HR", "Finance"], "Invalid department")
    .required("Department is required"),
  resume: yup.mixed().required("Resume file is required"),
});
