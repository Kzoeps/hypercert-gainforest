import {
  EAS,
  Offchain,
  SchemaEncoder,
  NO_EXPIRATION,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";
import { NextRequest, NextResponse } from "next/server";

const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // Sepolia v0.26
const SchemaUID =
  "0x3a65facf06635b21432225452ac5a5c00bc300c91ff6f940dc7244836f892616";
const schemaEncoder = new SchemaEncoder(
  "bytes32 hypercertId, string title, string description, address[] contributors, uint64 workStart, uint64 workEnd"
);
const encodedData = schemaEncoder.encodeData([
  {
    name: "hypercertId",
    value: "0x1234567890123456789012345678901234567890123456789012345678901234",
    type: "bytes32",
  },
  { name: "title", value: "Climate Action Project", type: "string" },
  {
    name: "description",
    value:
      "Community-driven initiative to reduce carbon emissions in local businesses",
    type: "string",
  },
  {
    name: "contributors",
    value: ["0x8352E6066F68c5f2bBd1d12A03CF81bEBDE6901d"],
    type: "address[]",
  },
  { name: "workStart", value: 1704067200, type: "uint64" }, // January 1, 2024
  { name: "workEnd", value: 1719792000, type: "uint64" }, // July 1, 2024
]);

export async function POST(request: NextRequest) {
  try {
    // const body = await request.json();
    const eas = new EAS(EASContractAddress);
    const provider = new ethers.AlchemyProvider(
      "sepolia",
      process.env.ALCHEMY_API_KEY!
    );
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
    eas.connect(signer);
    const transaction = await eas.attest({
      schema: SchemaUID,
      data: {
        recipient: "0x8352E6066F68c5f2bBd1d12A03CF81bEBDE6901d",
        expirationTime: NO_EXPIRATION,
        revocable: true,
        data: encodedData,
      },
    });
    const newAttestationId = await transaction.wait();
    console.log("new attestation UID", newAttestationId);
    console.log("transaction", transaction);
  } catch (e) {
    console.error(e);
    return NextResponse.json({
      error: "Failed to create attestation",
      details: e instanceof Error ? e.message : String(e),
    });
  }
}
