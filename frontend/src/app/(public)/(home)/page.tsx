"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { candidateSchema } from "@/schemas/candidate.schema";
import axios from "axios";
import ErrorAlert from "@/component/ErrorAlert";
import SuccessMessage from "@/component/SuccessMessage";

interface CandidateFormData {
  full_name: string;
  dob: string;
  experience: number;
  department: string;
  resume: FileList;
}

export default function CandidateForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    dob?: Date | undefined;
    full_name: string;
    experience: number;
    department: NonNullable<"IT" | "HR" | "Finance" | undefined>;
    resume: object;
  }>({
    resolver: yupResolver(candidateSchema),
  });

  const onSubmit = async (data: any) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    const formattedDob = new Date(data.dob).toISOString().split("T")[0];

    formData.append(
      "candidate",
      JSON.stringify({
        ...data,
        dob: formattedDob,
        experience: Number(data.experience),
      })
    );
    formData.append("resume", data.resume[0]);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates/`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setSuccessMessage("Candidate registered successfully!");
      reset();
    } catch (error: any) {
      setErrorMessage(error.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 relative">
      <button
        onClick={() => router.push("/login")}
        className="absolute top-4 right-4 bg-blue-800 text-white cursor-pointer px-4 py-2 rounded hover:bg-blue-500 transition"
      >
        Admin Login
      </button>

      {errorMessage && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}
      {successMessage && (
        <SuccessMessage
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-96 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">
          Candidate Registration
        </h2>

        <input
          {...register("full_name")}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500">{errors.full_name?.message}</p>

        <input
          type="text"
          {...register("dob")}
          placeholder="Date of Birth"
          onFocus={(e) => (e.target.type = "date")}
          onBlur={(e) =>
            e.target.value === ""
              ? (e.target.type = "text")
              : (e.target.type = "date")
          }
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500">{errors.dob?.message}</p>

        <input
          type="number"
          {...register("experience")}
          placeholder="Years of Experience"
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500">{errors.experience?.message}</p>

        <select
          {...register("department")}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Department</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
        <p className="text-red-500">{errors.department?.message}</p>

        <input
          type="file"
          {...register("resume")}
          accept=".pdf,.docx"
          className="w-full p-2 border rounded"
        />
        <p className="text-red-500">{errors.resume?.message}</p>

        <button
          type="submit"
          className="w-full p-2 bg-blue-800 cursor-pointer text-white rounded hover:bg-blue-500 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
