import { vi } from "vitest";

export const mockKafkaProducer = {
  emit: vi.fn().mockResolvedValue(undefined),
  send: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
};

export const kafkaMockProvider = {
  provide: "wallets-producer",
  useValue: mockKafkaProducer,
};
