import { randomBytes, randomUUID } from "node:crypto";

/**
 * Nexi XPay client (Hosted Payment Page + MIT recurring charges).
 *
 * Docs studied at developer.nexi.it: POST /orders/hpp, GET /orders/{orderId},
 * POST /orders/mit, recurrence contract flow (MIT_SCHEDULED). No official
 * Node/JS SDK exists — this is a thin wrapper around the raw REST API.
 *
 * NEXI_API_KEY / NEXI_BASE_URL are intentionally unset in Production until
 * we're ready to go live with real card charges — see checkout code paths
 * that fall back to the existing (fake) instant-activate behaviour when
 * this env var is missing.
 */

function baseUrl(): string {
  const url = process.env.NEXI_BASE_URL;
  if (!url) throw new Error("NEXI_BASE_URL is not set");
  return url.replace(/\/$/, "");
}

function apiKey(): string {
  const key = process.env.NEXI_API_KEY;
  if (!key) throw new Error("NEXI_API_KEY is not set");
  return key;
}

export function nexiConfigured(): boolean {
  return Boolean(process.env.NEXI_API_KEY && process.env.NEXI_BASE_URL);
}

/** Nexi orderId: unique in merchant domain, max 18 chars. */
export function generateNexiOrderId(prefix: string): string {
  const random = randomBytes(6).toString("hex"); // 12 chars
  return `${prefix}${random}`.slice(0, 18);
}

async function nexiFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: {
      "X-Api-Key": apiKey(),
      "Correlation-Id": randomUUID(),
      "Content-Type": "application/json",
      ...init.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.errors?.map((e: { description?: string }) => e.description).join("; ") ??
      `Nexi API error (${res.status})`;
    throw new Error(message);
  }

  return body as T;
}

export type NexiRecurrence =
  | { action: "NO_RECURRING" }
  | {
      action: "CONTRACT_CREATION";
      contractId: string;
      contractType: "MIT_SCHEDULED";
      contractFrequency: string; // number of days, as string
    }
  | { action: "SUBSEQUENT_PAYMENT"; contractId: string };

export type CreateHppOrderInput = {
  orderId: string;
  amountEuroCents: number;
  description: string;
  customerEmail?: string;
  resultUrl: string;
  cancelUrl: string;
  notificationUrl: string;
  recurrence?: NexiRecurrence;
};

export type CreateHppOrderResponse = {
  hostedPage: string;
  securityToken: string;
};

export async function createHppOrder(
  input: CreateHppOrderInput,
): Promise<CreateHppOrderResponse> {
  return nexiFetch<CreateHppOrderResponse>("/orders/hpp", {
    method: "POST",
    body: JSON.stringify({
      order: {
        orderId: input.orderId,
        amount: String(input.amountEuroCents),
        currency: "EUR",
        description: input.description,
      },
      customerInfo: input.customerEmail
        ? { cardHolderEmail: input.customerEmail }
        : undefined,
      paymentSession: {
        actionType: "PAY",
        amount: String(input.amountEuroCents),
        language: "slk",
        resultUrl: input.resultUrl,
        cancelUrl: input.cancelUrl,
        notificationUrl: input.notificationUrl,
      },
      recurrence: input.recurrence,
    }),
  });
}

export type NexiOperation = {
  operationResult:
    | "AUTHORIZED"
    | "EXECUTED"
    | "DECLINED"
    | "DENIED_BY_RISK"
    | "THREEDS_VALIDATED"
    | "THREEDS_FAILED"
    | "PENDING"
    | "CANCELED"
    | "VOIDED"
    | "REFUNDED"
    | "FAILED";
  operationType: string;
  operationTime: string;
};

export type NexiOrderStatus = {
  operations: NexiOperation[];
};

/** True once an order has actually settled money (used to activate membership). */
export function isNexiOrderPaid(status: NexiOrderStatus): boolean {
  return status.operations.some(
    (op) => op.operationResult === "EXECUTED" || op.operationResult === "AUTHORIZED",
  );
}

export function isNexiOrderFailed(status: NexiOrderStatus): boolean {
  return status.operations.some((op) =>
    ["DECLINED", "DENIED_BY_RISK", "THREEDS_FAILED", "CANCELED", "FAILED"].includes(
      op.operationResult,
    ),
  );
}

export async function getOrderStatus(orderId: string): Promise<NexiOrderStatus> {
  return nexiFetch<NexiOrderStatus>(`/orders/${orderId}`, { method: "GET" });
}

export type CreateMitChargeInput = {
  orderId: string;
  contractId: string;
  amountEuroCents: number;
  description: string;
};

/** Recurring renewal charge — no 3D Secure, merchant-initiated. Called from the daily cron. */
export async function createMitCharge(
  input: CreateMitChargeInput,
): Promise<NexiOrderStatus> {
  return nexiFetch<NexiOrderStatus>("/orders/mit", {
    method: "POST",
    body: JSON.stringify({
      order: {
        orderId: input.orderId,
        amount: String(input.amountEuroCents),
        currency: "EUR",
        description: input.description,
      },
      recurrence: {
        action: "SUBSEQUENT_PAYMENT",
        contractId: input.contractId,
      },
    }),
  });
}
