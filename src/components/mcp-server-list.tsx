import { type FormEvent } from "react";
import { Plug, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ConnectionPublic } from "@/lib/ads/connections";
import {
  addMcpServer,
  deleteMcpServer,
  testMcpServer,
  toggleMcpServer,
} from "@/lib/ads/connections-server";

export function McpServerList({
  data,
  mcpName,
  mcpUrl,
  mcpAuth,
  adding,
  testingId,
  onName,
  onUrl,
  onAuth,
  onAdding,
  onTesting,
  onData,
}: {
  data: ConnectionPublic | null;
  mcpName: string;
  mcpUrl: string;
  mcpAuth: string;
  adding: boolean;
  testingId: string | null;
  onName: (value: string) => void;
  onUrl: (value: string) => void;
  onAuth: (value: string) => void;
  onAdding: (value: boolean) => void;
  onTesting: (id: string | null) => void;
  onData: (data: ConnectionPublic) => void;
}) {
  async function addServer(event: FormEvent) {
    event.preventDefault();
    onAdding(true);
    try {
      const result = await addMcpServer({
        data: { name: mcpName, url: mcpUrl, auth: mcpAuth || undefined },
      });
      onData(result.connections);
      onName("");
      onUrl("");
      onAuth("");
      if (result.probe.ok) {
        toast.success(result.probe.toolCount ? `Connected · ${result.probe.toolCount} tools` : "Connected");
      } else {
        toast.error(result.probe.error || "Saved, but the server did not answer");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add server");
    } finally {
      onAdding(false);
    }
  }

  return (
    <section className="mt-6 rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2">
        <Plug className="size-4 text-primary-soft" />
        <h2 className="text-lg font-semibold tracking-tight">MCP servers</h2>
      </div>
      <p className="mt-2 text-sm text-muted">
        Point AdFuel at a brand wiki, catalog, or docs server. On generate, we pull resources and tools and fold them
        into the pack.
      </p>

      <ul className="mt-4 divide-y divide-border">
        {data?.servers.length ? (
          data.servers.map((server) => (
            <li key={server.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium">{server.name}</p>
                <p className="truncate text-xs text-faint">{server.url}</p>
                <p className="mt-1 text-xs text-muted">
                  {server.lastError
                    ? server.lastError
                    : server.toolCount != null
                      ? `${server.toolCount} tools · last ok`
                      : "Not tested yet"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={testingId === server.id}
                  onClick={() => {
                    onTesting(server.id);
                    testMcpServer({ data: { id: server.id } })
                      .then((result) => {
                        onData(result.connections);
                        if (result.probe.ok) toast.success(`Reached ${server.name}`);
                        else toast.error(result.probe.error || "No answer");
                      })
                      .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Test failed"))
                      .finally(() => onTesting(null));
                  }}
                >
                  {testingId === server.id ? "Testing…" : "Test"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toggleMcpServer({ data: { id: server.id, enabled: !server.enabled } })
                      .then(onData)
                      .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Could not update"));
                  }}
                >
                  {server.enabled ? "On" : "Off"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    deleteMcpServer({ data: { id: server.id } })
                      .then(onData)
                      .catch((err: unknown) => toast.error(err instanceof Error ? err.message : "Could not remove"));
                  }}
                >
                  <Trash2 className="size-4" />
                  Remove
                </Button>
              </div>
            </li>
          ))
        ) : (
          <li className="py-4 text-sm text-muted">None yet. A catalog MCP is enough to stop the model guessing.</li>
        )}
      </ul>

      <form onSubmit={addServer} className="mt-4 grid gap-3 border-t border-border pt-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="mcpName">Name</Label>
            <Input id="mcpName" value={mcpName} onChange={(e) => onName(e.target.value)} placeholder="Brand wiki" className="mt-2" required />
          </div>
          <div>
            <Label htmlFor="mcpAuth">Bearer token</Label>
            <Input
              id="mcpAuth"
              type="password"
              value={mcpAuth}
              onChange={(e) => onAuth(e.target.value)}
              placeholder="Optional"
              className="mt-2"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="mcpUrl">Server URL</Label>
          <Input
            id="mcpUrl"
            value={mcpUrl}
            onChange={(e) => onUrl(e.target.value)}
            placeholder="https://mcp.yourapp.com/sse"
            className="mt-2"
            required
          />
        </div>
        <Button type="submit" variant="outline" disabled={adding}>
          {adding ? "Connecting…" : "Add MCP server"}
        </Button>
      </form>
    </section>
  );
}
