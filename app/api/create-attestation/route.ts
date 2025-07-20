import { SCHEMA_UID } from "@/utils/attestation-constants";
import { eas, encodeData } from "@/utils/attestation-utils";
import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { recipient, ...body } = await request.json();
    const encodedData = encodeData(body);
    const transaction = await eas.attest({
      schema: SCHEMA_UID,
      data: {
        recipient,
        expirationTime: NO_EXPIRATION,
        revocable: true,
        data: encodedData,
      },
    });
    const newAttestationId = await transaction.wait();
    return NextResponse.json({
      message: "Attestation created successfully",
      attestationId: newAttestationId,
      transactionReceipt: transaction.receipt,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Failed to create attestation",
        details: e instanceof Error ? e.message : String(e),
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
