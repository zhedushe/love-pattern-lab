import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Language } from "@/lib/quizzes";

export type OrderStatus = "pending" | "paid" | "failed";
export type Order = {
  id: string;
  quizSlug: string;
  answers: number[];
  language: Language;
  status: OrderStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  createdAt: string;
  paidAt?: string;
};

type Store = { orders: Order[] };
let writeQueue = Promise.resolve();
const ORDER_STORE_FILE = path.join(process.cwd(), ".data", "orders.json");

async function readStore(): Promise<Store> {
  try {
    return JSON.parse(await readFile(ORDER_STORE_FILE, "utf8")) as Store;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { orders: [] };
    throw error;
  }
}

async function mutate(mutator: (store: Store) => void) {
  const operation = writeQueue.then(async () => {
    const file = ORDER_STORE_FILE;
    await mkdir(path.dirname(file), { recursive: true });
    const store = await readStore();
    mutator(store);
    const temporary = `${file}.${randomUUID()}.tmp`;
    await writeFile(temporary, JSON.stringify(store, null, 2), { encoding: "utf8", mode: 0o600 });
    await rename(temporary, file);
  });
  writeQueue = operation.catch(() => undefined);
  return operation;
}

export async function createOrder(input: Pick<Order, "quizSlug" | "answers" | "language">) {
  const order: Order = {
    ...input,
    id: randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString()
  };
  await mutate((store) => store.orders.push(order));
  return order;
}

export async function attachStripeSession(orderId: string, stripeSessionId: string) {
  await mutate((store) => {
    const order = store.orders.find((candidate) => candidate.id === orderId);
    if (!order) throw new Error("Order not found");
    order.stripeSessionId = stripeSessionId;
  });
}

export async function markOrderPaid(orderId: string, stripeSessionId: string, paymentIntentId?: string) {
  await mutate((store) => {
    const order = store.orders.find((candidate) => candidate.id === orderId);
    if (!order || order.stripeSessionId !== stripeSessionId) throw new Error("Order/session mismatch");
    if (order.status === "paid") return;
    order.status = "paid";
    order.stripePaymentIntentId = paymentIntentId;
    order.paidAt = new Date().toISOString();
  });
}

export async function markOrderFailed(orderId: string, stripeSessionId: string) {
  await mutate((store) => {
    const order = store.orders.find((candidate) => candidate.id === orderId);
    if (!order || order.stripeSessionId !== stripeSessionId || order.status === "paid") return;
    order.status = "failed";
  });
}

export async function findOrderBySession(stripeSessionId: string) {
  await writeQueue;
  const store = await readStore();
  return store.orders.find((order) => order.stripeSessionId === stripeSessionId);
}
