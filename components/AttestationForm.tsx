"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface AttestationFormInputs {
  hypercertId: string;
  title: string;
  description: string;
  contributors: string; // comma-separated addresses
  workStart: number;
  workEnd: number;
  recipient: string;
}

export function AttestationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AttestationFormInputs>();

  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    attestationIds: string[];
    transactionHash: string;
  } | null>(null);

  const autoFill = () => {
    reset({
      hypercertId:
        "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce0377cbeedb1a58e4c5f3c",
      title: "Cut weed",
      description: "Gardening for good. all organic food",
      contributors: "0xbFbBFacCD1126A11b8F84C60b09859F80f3BD10F",
      workStart: 1747792145,
      workEnd: 1750470545,
      recipient: "0xbFbBFacCD1126A11b8F84C60b09859F80f3BD10F",
    });
  };

  const onSubmit = async (data: AttestationFormInputs) => {
    setError(null);
    setResult(null);

    const payload = [
      {
        ...data,
        contributors: data.contributors
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    ];

    try {
      const res = await fetch("/api/create-attestation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setResult({
        attestationIds: json.attestationIds ?? [],
        transactionHash: json.transactionHash ?? "",
      });
      reset();
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast("Copied to clipboard");
  };

  // Tailwind helper class for inputs
  const inputCls =
    "border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-md space-y-4 bg-white p-6 rounded-lg shadow"
    >
      <h1 className="text-2xl font-semibold text-center">Create Attestation</h1>

      {/* hypercertId */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Hypercert ID</label>
        <input
          {...register("hypercertId", { required: true })}
          className={inputCls}
          placeholder="0x..."
        />
        {errors.hypercertId && (
          <span className="text-red-500 text-xs">Required</span>
        )}
      </div>

      {/* title */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Title</label>
        <input
          {...register("title", { required: true })}
          className={inputCls}
        />
        {errors.title && <span className="text-red-500 text-xs">Required</span>}
      </div>

      {/* description */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Description</label>
        <textarea
          {...register("description", { required: true })}
          className={`${inputCls} h-24 resize-none`}
        />
        {errors.description && (
          <span className="text-red-500 text-xs">Required</span>
        )}
      </div>

      {/* contributors */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Contributors (comma separated)</label>
        <input
          {...register("contributors", { required: true })}
          className={inputCls}
          placeholder="0xabc..., 0xdef..."
        />
        {errors.contributors && (
          <span className="text-red-500 text-xs">Required</span>
        )}
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col w-1/2">
          <label className="text-sm mb-1">Work Start (unix)</label>
          <input
            type="number"
            {...register("workStart", { required: true, min: 0 })}
            className={inputCls}
          />
          {errors.workStart && (
            <span className="text-red-500 text-xs">Required</span>
          )}
        </div>
        <div className="flex flex-col w-1/2">
          <label className="text-sm mb-1">Work End (unix)</label>
          <input
            type="number"
            {...register("workEnd", { required: true, min: 0 })}
            className={inputCls}
          />
          {errors.workEnd && (
            <span className="text-red-500 text-xs">Required</span>
          )}
        </div>
      </div>

      {/* recipient */}
      <div className="flex flex-col">
        <label className="text-sm mb-1">Recipient Address</label>
        <input
          {...register("recipient", { required: true })}
          className={inputCls}
          placeholder="0x..."
        />
        {errors.recipient && (
          <span className="text-red-500 text-xs">Required</span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={autoFill}
          className="flex-1 bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
        >
          AutoFill
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={
            "flex-1 bg-black text-white py-2 rounded hover:bg-gray-800 disabled:hover:bg-black disabled:opacity-50" +
            (isSubmitting ? " hover:cursor-wait" : "")
          }
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>

      {result && (
        <div className="mt-4 space-y-2">
          <span className="text-sm mb-2">Transaction Hash:</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs break-all flex-1">
              {result.transactionHash}
            </span>
            <button
              type="button"
              onClick={() => copyToClipboard(result.transactionHash)}
              className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
            >
              Copy
            </button>
          </div>
          <div className="flex flex-col gap-y-2">
            <span className="text-sm mb-2">Attestation IDs:</span>
            {result.attestationIds.map((id, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs break-all flex-1">{id}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(id)}
                  className="text-xs bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-600 whitespace-pre-wrap">{error}</p>
      )}
    </form>
  );
}
