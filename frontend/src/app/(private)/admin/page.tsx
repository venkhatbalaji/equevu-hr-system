"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ErrorAlert from "@/component/ErrorAlert";

interface Candidate {
  id: number;
  full_name: string;
  dob: string;
  experience: number;
  department: string;
  resume_path: string;
}

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [department, setDepartment] = useState<string | "">("");
  const router = useRouter();
  const fetchCandidates = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/candidates/`, {
        headers: { "X-ADMIN": "1" },
        params: {
          page,
          limit: 5,
          department: department || undefined,
        },
      })
      .then((response) => setCandidates(response.data))
      .catch(() => {
        setErrorMessage("Unauthorized: You must be an admin!");
        setTimeout(() => router.push("/login"), 2000);
      })
      .finally(() => setLoading(false));
  }, [isAdmin, page, department, router]);
  useEffect(() => {
    if (isAdmin) {
      fetchCandidates();
    }
  }, [isAdmin, page, department]);
  const handleDownloadResume = async (
    candidateId: number,
    candidateName: string
  ) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/candidates/${candidateId}/resume`,
        {
          headers: { "X-ADMIN": "1" },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers["content-disposition"];
      const fileName = contentDisposition
        ? contentDisposition.split("filename=")[1]
        : `resume_${candidateName}.pdf`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download resume", error);
      setErrorMessage("Failed to download resume. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {errorMessage && (
        <ErrorAlert
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={logout}
          className="w-50 bg-blue-800 text-white p-1 cursor-pointer rounded hover:bg-blue-500 transition"
        >
          Logout
        </button>
      </div>

      <div className="mb-4">
        <label className="font-semibold mr-2">Filter by Department:</label>
        <select
          className="p-2 border rounded"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">All</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {loading ? (
        <table className="w-full border-collapse border border-gray-300 animate-pulse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">DOB</th>
              <th className="p-2 border">Experience</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Resume</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="border">
                <td className="p-2 border bg-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </td>
                <td className="p-2 border bg-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </td>
                <td className="p-2 border bg-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </td>
                <td className="p-2 border bg-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                </td>
                <td className="p-2 border bg-gray-200">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : candidates.length === 0 ? (
        <div className="text-center text-gray-500 text-lg font-semibold mt-6">
          No Data to Show
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">DOB</th>
              <th className="p-2 border">Experience</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Resume</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="border">
                <td className="p-2 border">{candidate.full_name}</td>
                <td className="p-2 border">{candidate.dob}</td>
                <td className="p-2 border">{candidate.experience}</td>
                <td className="p-2 border">{candidate.department}</td>
                <td className="p-2 border">
                  <button
                    className="w-full bg-blue-800 text-white p-1 cursor-pointer rounded hover:bg-blue-500 transition"
                    onClick={() =>
                      handleDownloadResume(candidate.id, candidate.full_name)
                    }
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          className={`p-2 bg-gray-200 text-gray-700 rounded cursor-pointer ${
            page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-400"
          }`}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="p-2">Page {page}</span>
        <button
          className={`p-2 bg-gray-200 text-gray-700 rounded cursor-pointer ${
            candidates.length < 5
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-gray-400"
          }`}
          onClick={() => setPage((prev) => prev + 1)}
          disabled={candidates.length < 5}
        >
          Next
        </button>
      </div>
    </div>
  );
}
