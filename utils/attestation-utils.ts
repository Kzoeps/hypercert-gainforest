import { SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { hexlify } from "ethers";
import crypto from "crypto";

const schemaEncoder = new SchemaEncoder(
  "bytes32 hypercertId, string title, string description, address[] contributors, uint64 workStart, uint64 workEnd"
);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const encodeData = (data: any) => {
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
