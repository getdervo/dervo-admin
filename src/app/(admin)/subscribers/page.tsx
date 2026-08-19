import type { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Subscribers — Dervo Admin" };

// Always read fresh: an admin refreshing the page expects to see new signups.
export const dynamic = "force-dynamic";

type Subscriber = { id: string; email: string; created_at: string };

export default async function SubscribersPage() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase
    .from("subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <Shell count={null}>
        <p className="rounded-2xl border border-alert/30 bg-alert/5 px-5 py-4 text-[14px] text-alert">
          Couldn&apos;t load subscribers: {error.message}
        </p>
      </Shell>
    );
  }

  const rows = (data ?? []) as Subscriber[];

  return (
    <Shell count={rows.length}>
      {rows.length === 0 ? (
        <Empty />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-cardline bg-white shadow-dervo-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-cardline">
                <th className="px-5 py-3 text-[11.5px] font-bold tracking-[0.06em] text-muted uppercase">
                  Email
                </th>
                <th className="px-5 py-3 text-right text-[11.5px] font-bold tracking-[0.06em] text-muted uppercase">
                  Subscribed
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-cardline last:border-0"
                >
                  <td className="px-5 py-3.5 text-[14.5px] break-all text-navy">
                    {row.email}
                  </td>
                  <td className="px-5 py-3.5 text-right text-[13.5px] whitespace-nowrap text-muted">
                    {formatDate(row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  );
}

function Shell({
  count,
  children,
}: {
  count: number | null;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-6 flex items-baseline gap-3">
        <h1 className="text-[26px] font-extrabold tracking-[-0.01em] text-navy">
          Subscribers
        </h1>
        {count !== null && (
          <span className="text-[15px] font-semibold text-muted">{count}</span>
        )}
      </div>
      {children}
    </>
  );
}

function Empty() {
  return (
    <div className="rounded-2xl border border-dashed border-outline bg-white px-6 py-14 text-center">
      <p className="text-[15px] font-semibold text-navy">No subscribers yet</p>
      <p className="mt-1.5 text-[13.5px] text-muted">
        Signups from the newsletter form on the landing page will appear here.
      </p>
    </div>
  );
}
