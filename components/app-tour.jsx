"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import "driver.js/dist/driver.css";
import { useAuth } from "@clerk/nextjs";

export function AppTour() {
    const pathname = usePathname();
    const router = useRouter();
    const { isSignedIn, isLoaded } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted || !isLoaded) return;

        // Check if tour was already completed
        if (localStorage.getItem("splitr-tour-completed") === "true") return;

        let driverObj = null;

        // A small delay to let Next.js layout animations finish
        const timer = setTimeout(async () => {

            const { driver } = await import("driver.js");

            const currentStepStr = localStorage.getItem("splitr-tour-step") || "0";
            const currentStep = parseInt(currentStepStr, 10);

            const unauthSteps = [
                {
                    element: "#tour-go-to-dashboard-main",
                    popover: {
                        title: "Start Here!",
                        description: "Click here to go to your Dashboard and start splitting bills.",
                        side: "bottom",
                        onNextClick: () => {
                            localStorage.setItem("splitr-tour-step", "1");
                            if (driverObj) driverObj.destroy();
                            router.push("/dashboard");
                        }
                    }
                },
                { element: "#tour-how-it-works", popover: { title: "How It Works", description: "Learn how easy it is to automatically split expenses securely.", side: "bottom" } },
                { element: "#tour-sign-in", popover: { title: "Sign In", description: "Create an account or login to access the core Splitr engine.", side: "bottom" } }
            ];

            const allSteps = [
                {
                    element: "#tour-go-to-dashboard-main",
                    popover: {
                        title: "Go to Dashboard",
                        description: "This is your main control center. Always start your journey here!",
                        side: "bottom",
                        onNextClick: () => {
                            localStorage.setItem("splitr-tour-step", "1");
                            if (driverObj) driverObj.destroy();
                            router.push("/dashboard");
                        }
                    }
                },
                { element: "#tour-make-group", popover: { title: "Create a Group", description: "Create groups for trips, roommates, or office budgets first.", side: "top" } },
                { element: "#tour-add-expense", popover: { title: "Add an Expense", description: "Instantly record a new shared or personal expense here.", side: "left" } },
                { element: "#tour-group-chat", popover: { title: "Live Group Chat", description: "Communicate directly with your groups and settle debts instantly.", side: "top" } },
                {
                    element: "#tour-dashboard-graph",
                    popover: {
                        title: "Expense Summary",
                        description: "Track your monthly and yearly spending beautifully!",
                        side: "top",
                        onNextClick: () => {
                            localStorage.setItem("splitr-tour-completed", "true");
                            localStorage.removeItem("splitr-tour-step");
                            if (driverObj) driverObj.destroy();
                        }
                    }
                }
            ];

            const stepsToRun = isSignedIn ? allSteps : unauthSteps;

            // If we are signed in, but the current step elements don't exist on this page,
            // we must redirect to the correct page so the tour can continue!
            if (isSignedIn && currentStep >= 2 && pathname !== "/dashboard") {
                router.push("/dashboard");
                return;
            }

            if (isSignedIn && currentStep < 2 && pathname !== "/" && pathname !== "/how-it-works") {
                // Note: If they are on another page, they can still see header links, so it's fine.
            }

            if (stepsToRun.length > 0) {
                driverObj = driver({
                    showProgress: true,
                    allowClose: true,
                    showButtons: ['next', 'previous', 'close'],
                    onDestroyStarted: () => {
                        if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the rest of the tour?")) {
                            localStorage.setItem("splitr-tour-completed", "true");
                            localStorage.removeItem("splitr-tour-step");
                            driverObj.destroy();
                        }
                    },
                    steps: stepsToRun
                });

                // Only drive if the element for the current step actually exists on the screen
                const stepElementSelector = stepsToRun[currentStep]?.element;
                if (stepElementSelector && document.querySelector(stepElementSelector)) {
                    try {
                        driverObj.drive(currentStep);
                    } catch (e) {
                        console.log("Tour step failed", e);
                    }
                }
            }

        }, 1500);

        return () => {
            clearTimeout(timer);
            if (driverObj) driverObj.destroy();
        };

    }, [pathname, isLoaded, isSignedIn, router, mounted]);

    return null;
}
