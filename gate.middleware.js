/**
 * magpie-antigravity-effort / gate.middleware.js
 *
 * Magpie Gateway Middleware
 * -------------------------
 * Overrides reasoning effort / thinking level for Antigravity & Gemini models.
 * Solves Magpie issue #4838 where Antigravity cannot adjust reasoning effort.
 *
 * Supports GUI plugin options configuration via ctx.options.
 */

export function onRequest(body, ctx) {
  try {
    if (!body || typeof body !== "object") return body;

    const options = (ctx && ctx.options && typeof ctx.options === "object") ? ctx.options : {};

    // Check if plugin is explicitly disabled
    if (options.enabled === false) return body;

    // Target reasoning effort (default: "high")
    // Allowed values: "low" | "medium" | "high" | "off"
    const targetEffort = (typeof options.effort === "string" && options.effort.trim())
      ? options.effort.trim().toLowerCase()
      : "high";

    if (targetEffort === "off" || targetEffort === "none") {
      return body;
    }

    // Target models list/patterns
    const patterns = Array.isArray(options.applyTo) && options.applyTo.length > 0
      ? options.applyTo
      : ["gemini", "flash", "antigravity"];

    const modelName = typeof body.model === "string" ? body.model.toLowerCase() : "";
    const isTargetModel = patterns.some((p) => {
      if (typeof p !== "string") return false;
      const lower = p.toLowerCase().trim();
      return lower.length > 0 && modelName.includes(lower);
    });

    if (!isTargetModel) return body;

    // 1. OpenAI / generic reasoning effort parameters
    body.reasoning_effort = targetEffort;
    body.reasoningEffort = targetEffort;

    // 2. OpenCode / custom reasoning object
    if (!body.reasoning || typeof body.reasoning !== "object") {
      body.reasoning = { effort: targetEffort };
    } else {
      body.reasoning.effort = targetEffort;
    }

    // 3. Gemini / Vertex generationConfig thinkingConfig
    if (!body.generationConfig || typeof body.generationConfig !== "object") {
      body.generationConfig = {
        thinkingConfig: {
          thinkingLevel: targetEffort,
        },
      };
    } else {
      if (!body.generationConfig.thinkingConfig || typeof body.generationConfig.thinkingConfig !== "object") {
        body.generationConfig.thinkingConfig = {
          thinkingLevel: targetEffort,
        };
      } else {
        body.generationConfig.thinkingConfig.thinkingLevel = targetEffort;
      }
    }

    // Optional token budget override if configured (> 0)
    if (typeof options.thinkingBudget === "number" && options.thinkingBudget > 0) {
      body.generationConfig.thinkingConfig.thinkingBudget = Math.floor(options.thinkingBudget);
    }

    return body;
  } catch (err) {
    // In moejs runtime, middleware must never throw; unhandled exceptions cancel changes
    return body;
  }
}
