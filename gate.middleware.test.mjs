import test from "node:test";
import assert from "node:assert/strict";
import { onRequest } from "./gate.middleware.js";

test("defaults to high effort for antigravity and gemini models", () => {
  const req = { model: "antigravity/gemini-3.8-flash", messages: [] };
  const res = onRequest(req, {});
  assert.equal(res.reasoning_effort, "high");
  assert.equal(res.reasoningEffort, "high");
  assert.equal(res.reasoning.effort, "high");
  assert.equal(res.generationConfig.thinkingConfig.thinkingLevel, "high");
});

test("respects ctx.options.effort = 'medium'", () => {
  const req = { model: "gemini-2.5-pro", messages: [] };
  const res = onRequest(req, { options: { effort: "medium" } });
  assert.equal(res.reasoning_effort, "medium");
  assert.equal(res.generationConfig.thinkingConfig.thinkingLevel, "medium");
});

test("bypasses when ctx.options.effort = 'off'", () => {
  const req = { model: "antigravity/gemini-3.8-flash", messages: [] };
  const res = onRequest(req, { options: { effort: "off" } });
  assert.equal(res.reasoning_effort, undefined);
  assert.equal(res.generationConfig, undefined);
});

test("bypasses when ctx.options.enabled = false", () => {
  const req = { model: "antigravity/gemini-3.8-flash", messages: [] };
  const res = onRequest(req, { options: { enabled: false, effort: "high" } });
  assert.equal(res.reasoning_effort, undefined);
  assert.equal(res.generationConfig, undefined);
});

test("respects custom applyTo filter", () => {
  const req1 = { model: "gpt-4o", messages: [] };
  const res1 = onRequest(req1, { options: { applyTo: ["custom-model"] } });
  assert.equal(res1.reasoning_effort, undefined);

  const req2 = { model: "custom-model-thinking", messages: [] };
  const res2 = onRequest(req2, { options: { applyTo: ["custom-model"] } });
  assert.equal(res2.reasoning_effort, "high");
});

test("supports thinkingBudget option", () => {
  const req = { model: "gemini-3.8-flash", messages: [] };
  const res = onRequest(req, { options: { effort: "high", thinkingBudget: 4096 } });
  assert.equal(res.generationConfig.thinkingConfig.thinkingBudget, 4096);
});

test("handles non-object and null gracefully without throwing", () => {
  assert.equal(onRequest(null, {}), null);
  assert.equal(onRequest(undefined, {}), undefined);
  assert.equal(onRequest("test", {}), "test");
});
