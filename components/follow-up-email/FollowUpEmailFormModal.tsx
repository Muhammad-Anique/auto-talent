"use client";

import { useState } from "react";

interface FollowUpEmailFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, jobDescription: string, tone: number) => void;
}

const FollowUpEmailFormModal = ({
  isOpen,
  onClose,
  onSubmit,
}: FollowUpEmailFormModalProps) => {
  const [title, setTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState(5); // Default tone to 5 (neutral)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, jobDescription, tone);
    onClose(); // Close the modal after submitting
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create New Cover Letter
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b6949]"
              required
            />
          </div>

          <div>
            <label
              htmlFor="jobDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5b6949]"
              rows={4}
              required
            />
          </div>

          <div>
            <label
              htmlFor="tone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tone (1 = Formal, 10 = Casual)
            </label>
            <input
              id="tone"
              type="range"
              min="1"
              max="10"
              value={tone}
              onChange={(e) => setTone(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>1 (Formal)</span>
              <span>10 (Casual)</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#5b6949] text-white rounded-lg hover:bg-[#5b6949]/90 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FollowUpEmailFormModal;
