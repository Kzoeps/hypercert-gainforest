import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ZodError } from "zod";
import { ethers, hexlify } from "ethers";
import crypto from "crypto";
import {
  AttestationPayload,
  EAS_CONTRACT_ADDRESS,
} from "./attestation-constants";
import { NextResponse } from "next/server";

const schemaEncoder = new SchemaEncoder(
  "bytes32 hypercertId, string title, string description, address[] contributors, uint64 workStart, uint64 workEnd"
);
export const encodeData = (data: Omit<AttestationPayload, "recipient">) => {
  const { title, description, contributors, workStart, workEnd } = data;
  const encodedData = schemaEncoder.encodeData([
    {
      name: "hypercertId",
      value: hexlify(crypto.randomBytes(32)),
      type: "bytes32",
    },
    { name: "title", value: title, type: "string" },
    { name: "description", value: description, type: "string" },
    { name: "contributors", value: contributors, type: "address[]" },
    { name: "workStart", value: workStart, type: "uint64" },
    { name: "workEnd", value: workEnd, type: "uint64" },
  ]);
  return encodedData;
};

export const eas = new EAS(EAS_CONTRACT_ADDRESS);
const provider = new ethers.AlchemyProvider(
  process.env.NEXT_PUBLIC_NETWORK!,
  process.env.ALCHEMY_API_KEY!
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
eas.connect(signer);

export function formatZodError(error: ZodError) {
  return error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
}

export function handleError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: formatZodError(error),
      },
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } else {
    return NextResponse.json(
      {
        error: "Unknown error occurred",
        details: String(error),
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
