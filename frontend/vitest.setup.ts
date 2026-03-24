import { afterEach } from "vitest";
import "@testing-library/jest-dom";
import { cleanup } from "./tests/custom-render";

afterEach(() => cleanup());
