import { createFileRoute } from "@tanstack/react-router";
import { fulfillStripeSession } from "@/lib/ads/billing-server";
import { verifyStripeWebhook } from "@/lib/ads/billing";

export const Route = createFileRoute("/api/billing/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const signature = request.headers.get("stripe-signature");
        try {
          const event = await verifyStripeWebhook(raw, signature);
          if (event.type === "checkout.session.completed") {
            await fulfillStripeSession(event.data.object.id);
          }
          return new Response(JSON.stringify({ received: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Webhook failed";
          return new Response(JSON.stringify({ error: message }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});
