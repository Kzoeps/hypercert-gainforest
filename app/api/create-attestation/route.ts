import { SCHEMA_PAYLOAD, SCHEMA_UID } from "@/utils/attestation-constants";
import { eas, encodeData, handleError } from "@/utils/attestation-utils";
import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const zodData = SCHEMA_PAYLOAD.parse(data);
    const { recipient, ...body } = zodData;
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
    return handleError(e);
  }
}
