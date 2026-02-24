import Link from "next/link";
import { Users, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GroupList({ groups }) {
  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No groups yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Create a group to start tracking shared expenses
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        // Calculate total balance in the group
        const balance = group.balance || 0;
        const hasBalance = balance !== 0;

        return (
          <div key={group.id} className="flex items-center justify-between hover:bg-zinc-50 border border-transparent hover:border-zinc-100 p-3 rounded-xl transition-all">
            <Link
              href={`/groups/${group.id}`}
              className="flex items-center gap-3 flex-1"
            >
              <div className="bg-zinc-900 p-2 rounded-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-zinc-900">{group.name}</p>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                    {group.members.length} members
                  </span>
                  {hasBalance && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ₹{balance > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                      {balance > 0 ? "+" : ""}${balance.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <Button asChild variant="outline" size="icon" className="ml-2 shrink-0 border-zinc-200 text-zinc-600 bg-white shadow-sm hover:text-black hover:bg-zinc-100">
              <Link href={`/groups/${group.id}/chat`}>
                <MessageCircle className="h-4 w-4" />
                <span className="sr-only">Live Chat</span>
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
