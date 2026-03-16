"use client";

import { useState } from "react";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { format, subDays, subMonths, isAfter } from "date-fns";
import { BarLoader } from "react-spinners";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function ReportSection() {
    const { data: reportData, isLoading } = useConvexQuery(api.dashboard.getReportData);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerateReport = (type) => {
        if (!reportData) return;
        setIsGenerating(true);

        try {
            const now = new Date();
            let filteredData = [];
            let title = "";

            if (type === "weekly") {
                const oneWeekAgo = subDays(now, 7);
                filteredData = reportData.filter(d => isAfter(new Date(d.date), oneWeekAgo));
                title = "Weekly Expense Report";
            } else {
                const oneMonthAgo = subMonths(now, 1);
                filteredData = reportData.filter(d => isAfter(new Date(d.date), oneMonthAgo));
                title = "Monthly Expense Report";
            }

            // Generate PDF
            const doc = new jsPDF();

            // Add Title
            doc.setFontSize(22);
            doc.setTextColor(24, 24, 27); // zinc-900
            doc.text(title, 14, 22);

            // Add Date Range
            doc.setFontSize(11);
            doc.setTextColor(113, 113, 122); // zinc-500
            doc.text(`Generated on: ${format(now, "MMM do, yyyy 'at' p")}`, 14, 30);

            // Summary Stats
            const totalPersonalSpent = filteredData.reduce((acc, curr) => curr.type !== "Paid" ? acc + curr.yourShare : acc, 0);
            const totalPaidOut = filteredData.reduce((acc, curr) => curr.type === "Paid" ? acc + curr.amount : acc, 0);

            doc.setFontSize(12);
            doc.setTextColor(24, 24, 27);
            doc.text(`Total Personal Share: Rs. ${totalPersonalSpent.toFixed(2)}`, 14, 42);
            doc.text(`Total Paid Out: Rs. ${totalPaidOut.toFixed(2)}`, 14, 48);

            // Table
            const tableColumn = ["Date", "Description", "Category", "Payer", "Total Amount", "Your Share"];
            const tableRows = [];

            filteredData.forEach(expense => {
                const expenseData = [
                    format(new Date(expense.date), "MMM dd, yyyy"),
                    expense.description,
                    expense.category || "-",
                    expense.payerName,
                    `Rs. ${expense.amount.toFixed(2)}`,
                    `Rs. ${expense.yourShare.toFixed(2)}`
                ];
                tableRows.push(expenseData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 55,
                theme: 'striped',
                styles: { font: "helvetica", fontSize: 10 },
                headStyles: { fillColor: [24, 24, 27] } // zinc-900 header
            });

            doc.save(`Splitr_${title.replace(/\s+/g, '_')}_${format(now, "yyyyMMdd")}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex justify-center py-6">
                    <BarLoader width={"100%"} color="#36d7b7" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-zinc-200 shadow-sm mt-6">
            <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/50 rounded-t-xl">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-zinc-600" />
                    <CardTitle className="text-xl">Export Reports</CardTitle>
                </div>
                <CardDescription>
                    Download your weekly and monthly summaries as a PDF to share via email.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                    <Button
                        variant="outline"
                        className="flex-1 min-w-[200px] border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 shadow-sm font-medium h-12"
                        onClick={() => handleGenerateReport("weekly")}
                        disabled={isGenerating}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Weekly Report PDF
                    </Button>
                    <Button
                        className="flex-1 min-w-[200px] bg-zinc-950 text-white hover:bg-zinc-800 shadow-md font-medium h-12"
                        onClick={() => handleGenerateReport("monthly")}
                        disabled={isGenerating}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Monthly Report PDF
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
