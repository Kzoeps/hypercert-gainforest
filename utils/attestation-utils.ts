import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers, hexlify } from "ethers";
import crypto from "crypto";
import { EAS_CONTRACT_ADDRESS } from "./attestation-constants";

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

export const eas = new EAS(EAS_CONTRACT_ADDRESS);
const provider = new ethers.AlchemyProvider(
  process.env.NEXT_PUBLIC_NETWORK!,
  process.env.ALCHEMY_API_KEY!
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
eas.connect(signer);
