// Modular AI provider layer.
//
// The function code never talks to a specific vendor SDK directly — it
// calls `generateAuditJson(prompt)` from this file. To swap providers
// (OpenAI -> Anthropic -> Azure OpenAI -> local model), only this file
// needs to change.
//
// If no API key is configured, this falls back to a deterministic,
// heuristic mock so the app is fully functional without any paid service.

const PROVIDER = process.env.AI_PROVIDER || 'openai';
const MODEL = process.env.AI_MODEL || 'gpt-4o-mini';

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null; // No key configured -> caller falls back to mock.

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a conversion rate optimisation (CRO) auditor. Always respond with strict, valid JSON matching the requested schema and nothing else — no markdown fences, no commentary.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`AI provider error (${response.status}): ${text.slice(0, 200)}`);
  }

  const data = await response.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (!raw) throw new Error('AI provider returned an empty response.');
  return JSON.parse(raw);
}

function buildMockResult(auditType, url, device) {
  const isProduct = auditType === 'product';
  const score = 58 + Math.floor(Math.random() * 22); // 58-79, feels "real" without a live model

  const findings = isProduct
    ? [
        { title: 'Value proposition is buried', description: 'Key benefits sit below the fold on ' + device + '.', severity: 'high' },
        { title: 'Trust signals are thin', description: 'No reviews or guarantees visible near the add-to-cart button.', severity: 'medium' },
        { title: 'CTA competes with secondary links', description: 'Multiple equally-weighted actions dilute the primary action.', severity: 'medium' },
      ]
    : [
        { title: 'Hero lacks a single clear action', description: 'Visitors are offered several competing next steps.', severity: 'high' },
        { title: 'Above-the-fold clarity is low', description: 'The core offer is not obvious within 3 seconds.', severity: 'medium' },
        { title: 'Social proof appears too late', description: 'Trust indicators are placed after the primary CTA.', severity: 'low' },
      ];

  const recommendations = isProduct
    ? [
        { title: 'Lead with outcome-driven copy', description: 'Rewrite the headline to state the primary buyer benefit.' },
        { title: 'Add trust markers near the CTA', description: 'Place reviews, guarantees or return policy beside add-to-cart.' },
      ]
    : [
        { title: 'Simplify the hero to one action', description: 'Remove or visually de-emphasise competing CTAs.' },
        { title: 'Pull proof points above the fold', description: 'Surface a testimonial or trust badge earlier in the page.' },
      ];

  return {
    auditType,
    url,
    device,
    score,
    findings,
    recommendations,
    generatedBy: 'mock',
  };
}

async function generateAuditJson({ auditType, url, device, pageSnapshot }) {
  const prompt = `Audit type: ${auditType}
URL: ${url}
Device: ${device}
Page snapshot (may be partial or empty): ${pageSnapshot || 'unavailable'}

Return JSON with this exact shape:
{
  "score": number (0-100),
  "findings": [ { "title": string, "description": string, "severity": "high"|"medium"|"low" } ] (3-5 items),
  "recommendations": [ { "title": string, "description": string } ] (2-4 items)
}`;

  try {
    if (PROVIDER === 'openai') {
      const result = await callOpenAI(prompt);
      if (result) {
        return { auditType, url, device, generatedBy: 'openai', ...result };
      }
    }
  } catch (err) {
    // Log for observability, but never fail the whole request just because
    // the AI provider hiccuped — degrade to the mock so the user still
    // gets a usable result.
    console.error('AI provider call failed, falling back to mock:', err.message);
  }

  return buildMockResult(auditType, url, device);
}

module.exports = { generateAuditJson };
