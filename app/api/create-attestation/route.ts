import { SCHEMA_PAYLOAD, SCHEMA_UID } from "@/utils/attestation-constants";
import { eas, encodeData, formatZodError } from "@/utils/attestation-utils";
import { NO_EXPIRATION } from "@ethereum-attestation-service/eas-sdk";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

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
    if (e instanceof ZodError) {
      const zodErrors = formatZodError(e);
      return NextResponse.json(
        {
          error: "Validation failed",
          details: zodErrors,
        },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
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
