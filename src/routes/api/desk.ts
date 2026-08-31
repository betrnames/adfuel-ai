import { createFileRoute } from "@tanstack/react-router";
import { answerDesk, parseDeskBody } from "@/lib/desk/answer";

export const Route = createFileRoute("/api/desk")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const parsed = parseDeskBody(body);
          const result = await answerDesk(parsed);
          return new Response(JSON.stringify(result), {
            status: result.ok ? 200 : 429,
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Desk failed";
          return new Response(JSON.stringify({ ok: false, error: message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
