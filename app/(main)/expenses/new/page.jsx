"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ExpenseForm } from "./components/expense-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";

function NewExpenseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPersonal = searchParams.get("personal") === "true";

  return (
    <div className="container max-w-3xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-5xl gradient-title">
          {isPersonal ? "Add Personal Expense" : "Add a new expense"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isPersonal ? "Record an expense for your own tracking" : "Record a new expense to split with others"}
        </p>
      </div>

      <Card>
        <CardContent>
          <Tabs className="pb-3" defaultValue={isPersonal ? "personal" : "individual"}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="group">Group</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-0 pt-4">
              <ExpenseForm
                type="personal"
                onSuccess={() => router.push(`/dashboard`)}
              />
            </TabsContent>
            <TabsContent value="individual" className="mt-0 pt-4">
              <ExpenseForm
                type="individual"
                onSuccess={(id) => router.push(`/person/${id}`)}
              />
            </TabsContent>
            <TabsContent value="group" className="mt-0 pt-4">
              <ExpenseForm
                type="group"
                onSuccess={(id) => router.push(`/groups/${id}`)}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewExpensePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewExpenseContent />
    </Suspense>
  );
}
