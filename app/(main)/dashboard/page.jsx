"use client";

import { api } from "@/convex/_generated/api";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { BarLoader } from "react-spinners";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Users, CreditCard, ChevronRight, UserPlus, FileText } from "lucide-react";
import Link from "next/link";
import { ExpenseSummary } from "./components/expense-summary";
import { BalanceSummary } from "./components/balance-summary";
import { GroupList } from "./components/group-list";
import { ReportSection } from "./components/report-section";
import { PersonalHistory } from "./components/personal-history";
import { DashboardChatWidget } from "./components/dashboard-chat-widget";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { data: balances, isLoading: balancesLoading } = useConvexQuery(
    api.dashboard.getUserBalances
  );

  const { data: groups, isLoading: groupsLoading } = useConvexQuery(
    api.dashboard.getUserGroups
  );

  const { data: totalSpent, isLoading: totalSpentLoading } = useConvexQuery(
    api.dashboard.getTotalSpent
  );

  const { data: monthlySpending, isLoading: monthlySpendingLoading } =
    useConvexQuery(api.dashboard.getMonthlySpending);

  const isLoading =
    balancesLoading ||
    groupsLoading ||
    totalSpentLoading ||
    monthlySpendingLoading;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {isLoading ? (
        <div className="w-full py-12 flex justify-center">
          <BarLoader width={"100%"} color="#36d7b7" />
        </div>
      ) : (
        <>
          <div className="flex  justify-between flex-col sm:flex-row sm:items-center gap-4">
            <h1 className="text-5xl gradient-title">Dashboard</h1>
          </div>

          <Tabs defaultValue="groups" className="w-full mt-6">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-8">
              <TabsTrigger value="personal">Personal Tracker</TabsTrigger>
              <TabsTrigger value="groups">Group Splitting</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-8 shadow-lg flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">Personal Finances</h2>
                    <p className="text-slate-300">Track and manage your individual expenses without splitting. Keep your personal budget perfectly in check.</p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <Button asChild size="lg" className="h-full px-8 bg-black hover:bg-slate-800 text-white shadow-lg">
                    <Link href="/expenses/new?personal=true">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Add Personal Expense
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column / Main content */}
                <div className="lg:col-span-2 space-y-6">
                  <div id="tour-dashboard-graph">
                    <ExpenseSummary
                      monthlySpending={monthlySpending}
                      totalSpent={totalSpent}
                    />
                  </div>

                  <div className="shadow-sm">
                    <PersonalHistory />
                  </div>
                </div>

                {/* Right column / Sidebar */}
                <div className="space-y-6">
                  <ReportSection />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Create Group - Big Feature Block */}
                <Link href="/contacts?createGroup=true" className="group h-full">
                  <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-2xl p-6 h-full shadow-lg border border-transparent hover:border-zinc-700 transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between" id="tour-make-group">
                    <div className="bg-white/10 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <Users className="text-white h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">Create a Group</h3>
                      <p className="text-zinc-400 text-sm">Start tracking shared expenses with friends, roommates, or on a trip. Generate a code instantly.</p>
                    </div>
                  </div>
                </Link>

                {/* Join Group - Big Feature Block */}
                <Link href="/contacts?joinGroup=true" className="group h-full">
                  <div className="bg-white rounded-2xl p-6 h-full shadow-md border border-zinc-200 hover:border-blue-500 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between">
                    <div className="bg-blue-50 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <UserPlus className="text-blue-600 h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-blue-600 transition-colors">Join via Code</h3>
                      <p className="text-zinc-500 text-sm">Got an invite code? Join an active group seamlessly and view all group balances.</p>
                    </div>
                  </div>
                </Link>

                {/* Add Expense - Big Feature Block */}
                <Link href="/expenses/new" className="group h-full">
                  <div className="bg-white rounded-2xl p-6 h-full shadow-md border border-zinc-200 hover:border-green-500 transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between" id="tour-add-expense">
                    <div className="bg-green-50 w-14 h-14 rounded-full flex items-center justify-center mb-6">
                      <PlusCircle className="text-green-600 h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-zinc-900 mb-2 group-hover:text-green-600 transition-colors">Add Split Expense</h3>
                      <p className="text-zinc-500 text-sm">Add a new receipt, split equally or by percentage right into an existing group.</p>
                    </div>
                  </div>
                </Link>

              </div>

              {/* Balance overview cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {balances?.totalBalance > 0 ? (
                        <span className="text-green-600">
                          +₹{balances?.totalBalance.toFixed(2)}
                        </span>
                      ) : balances?.totalBalance < 0 ? (
                        <span className="text-red-600">
                          -₹{Math.abs(balances?.totalBalance).toFixed(2)}
                        </span>
                      ) : (
                        <span>₹0.00</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {balances?.totalBalance > 0
                        ? "You are owed money"
                        : balances?.totalBalance < 0
                          ? "You owe money"
                          : "All settled up!"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      You are owed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ₹{balances?.youAreOwed.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      From {balances?.oweDetails?.youAreOwedBy?.length || 0} people
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      You owe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {balances?.oweDetails?.youOwe?.length > 0 ? (
                      <>
                        <div className="text-2xl font-bold text-red-600">
                          ₹{balances?.youOwe.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          To {balances?.oweDetails?.youOwe?.length || 0} people
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">₹0.00</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          You don't owe anyone
                        </p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Main dashboard content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column (Middle area) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Expense summary moved to the main column */}
                  <div id="tour-dashboard-graph">
                    <ExpenseSummary
                      monthlySpending={monthlySpending}
                      totalSpent={totalSpent}
                    />
                  </div>

                  {/* Chat on Dashboard */}
                  <div id="tour-group-chat">
                    <DashboardChatWidget groups={groups} />
                  </div>
                </div>

                {/* Right column (Sidebar) */}
                <div className="space-y-6">
                  {/* Groups list placed on the side */}
                  <Card>
                    <CardHeader className="pb-3 border-b border-zinc-100 mb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle>Your Active Groups</CardTitle>
                        <Button variant="link" asChild className="p-0">
                          <Link href="/contacts">
                            View all
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <GroupList groups={groups} />
                    </CardContent>
                  </Card>

                  {/* Balance details */}
                  <Card>
                    <CardHeader className="pb-3 border-b border-zinc-100 mb-4">
                      <div className="flex items-center justify-between">
                        <CardTitle>Balance Details</CardTitle>
                        <Button variant="link" asChild className="p-0">
                          <Link href="/contacts">
                            View all
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <BalanceSummary balances={balances} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
