import { type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { BetaMessageParam } from "@anthropic-ai/sdk/resources/beta/messages/messages";
import { getSwiggyToken } from "@/lib/swiggy-auth";
import { buildSystemPrompt, AGENT_MODEL, MAX_HISTORY_TURNS, MAX_TOKENS, MCP_SERVERS } from "@/lib/agent";
import type { ConversationMessage } from "@/types";

// Avoids loading unused tool definitions (each server ~1,000-2,000 input tokens per call).
// Only restricts when the conversation clearly belongs to one service; defaults to all servers
// when intent is ambiguous or mixed, so there's no risk of the wrong tools being unavailable.
function selectActiveServers(messages: ConversationMessage[]) {
  const text = messages.slice(-6).map((m) => m.content).join(" ").toLowerCase();

  const isGrocery = /\b(grocery|groceries|instamart|milk|bread|eggs|vegetable|fruit|snack|household)\b/.test(text);
  const isDineout = /\b(book\s+(?:a\s+)?table|reserv(?:ation)?|dine\s*out|rooftop|date\s+night|bar.*tonight|tonight.*bar|prebook|dineout)\b/.test(text);
  const isDelivery = /\b(deliver(?:y|ed)?|order\s+food|food\s+delivery|biryani|pizza|burger|checkout|add\s+to\s+cart)\b/.test(text);

  const detected = [isGrocery, isDineout, isDelivery].filter(Boolean).length;
  if (detected === 1) {
    if (isGrocery) return MCP_SERVERS.filter((s) => s.name === "swiggy-instamart");
    if (isDineout) return MCP_SERVERS.filter((s) => s.name === "swiggy-dineout");
    if (isDelivery) return MCP_SERVERS.filter((s) => s.name === "swiggy-food");
  }
  return [...MCP_SERVERS];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { messages: ConversationMessage[]; location?: string };
  const swiggyToken = await getSwiggyToken();

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();

  const responseStream = new ReadableStream({
    async start(controller) {
      const enqueue = (data: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));

      try {
        const trimmed = body.messages.slice(-MAX_HISTORY_TURNS);

        // Cache the last assistant message so all prior context is served from cache
        // on the next request, saving input tokens on every turn after the first two.
        const messages: BetaMessageParam[] = trimmed.map((m, i) => {
          const isLastAssistant = m.role === "assistant" && i === trimmed.length - 2;
          return {
            role: m.role,
            content: isLastAssistant
              ? [{ type: "text" as const, text: m.content, cache_control: { type: "ephemeral" as const } }]
              : m.content,
          };
        });

        const activeServers = swiggyToken ? selectActiveServers(body.messages) : [];

        const baseParams = {
          model: AGENT_MODEL,
          max_tokens: MAX_TOKENS,
          system: [
            {
              type: "text" as const,
              text: buildSystemPrompt(body.location),
              cache_control: { type: "ephemeral" as const },
            },
          ],
          messages,
        };

        const claudeStream =
          swiggyToken && activeServers.length
            ? client.beta.messages.stream({
                ...baseParams,
                betas: ["mcp-client-2025-11-20"],
                mcp_servers: activeServers.map((s) => ({
                  type: "url" as const,
                  url: s.url,
                  name: s.name,
                  authorization_token: swiggyToken,
                })),
                tools: activeServers.map((s) => ({
                  type: "mcp_toolset" as const,
                  mcp_server_name: s.name,
                })),
              })
            : client.beta.messages.stream(baseParams);

        // Stream text in real-time for fast responses.
        // When a tool_use block starts, send a "reset" event so the client
        // clears any pre-tool narration that was already streamed.
        // After tool calls complete the model's final text streams normally.
        let inTextBlock = false;

        for await (const event of claudeStream) {
          if (event.type === "content_block_start") {
            const block = (event as { content_block?: { type: string } }).content_block;
            if (block?.type === "tool_use" || block?.type === "mcp_tool_use") {
              inTextBlock = false;
              enqueue({ type: "reset" }); // clear any pre-tool narration
            } else if (block?.type === "text") {
              inTextBlock = true;
            }
          } else if (
            event.type === "content_block_delta" &&
            (event.delta as { type: string }).type === "text_delta" &&
            inTextBlock
          ) {
            enqueue({ type: "text", text: (event.delta as { type: string; text?: string }).text ?? "" });
          } else if (event.type === "content_block_stop") {
            inTextBlock = false;
          }
        }

        enqueue({ type: "done" });
      } catch (err) {
        enqueue({ type: "error", message: err instanceof Error ? err.message : "An error occurred" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
