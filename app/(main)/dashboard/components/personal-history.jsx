"use client";

import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseList } from "@/components/expense-list";

export function PersonalHistory() {
    const { data: personalExpenses, isLoading } = useConvexQuery(
        api.expenses.getPersonalExpenses
    );

    if (isLoading) {
        return (
            <Card>
                <CardContent className="py-8 flex justify-center">
                    <BarLoader width={"100%"} color="#36d7b7" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Personal Expenses</CardTitle>
            </CardHeader>
            <CardContent>
                <ExpenseList
                    expenses={personalExpenses}
                    showOtherPerson={false}
                    isGroupExpense={false}
                />
            </CardContent>
        </Card>
    );
}
