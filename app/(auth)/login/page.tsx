"use client";
import { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { LoginForm } from "@/components/forms/auth/login-form";
import Image from "next/image";

export default function Login() {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setImageLoaded(true);
        }, 50);

        return () => window.clearTimeout(timer);
    }, []);

    return (
        <main className="min-h-screen ">
            <div className="relative mx-auto flex min-h-[calc(100vh-2rem)]    sm:p-8 lg:p-10">
                <div className="absolute top-7 left-7 flex items-center gap-2.5">
                    <Image src="/logo1.png" alt="Logo" width={100} height={100} className="  " />
                </div>

                {/* Blur bg */}

                <div className="absolute top-0 left-0 h-48 w-48 rounded-2xl bg-primary blur-[250px]" />


                <section className="flex w-full items-center justify-center lg:w-1/2">
                    <Card className="w-full max-w-[410px] rounded-3xl border-[10px] border-[#EDEDED]/[0.7] bg-[#FCFCFC] px-8 py-8 shadow-[0_12px_30px_rgba(16,24,40,0.06)]">
                        <CardHeader className="pb-7 text-center">
                            <CardTitle className="text-2xl font-semibold text-primary-text font-onset">Login</CardTitle>
                            <CardDescription className="text-sm text-gray">
                                Enter your details to continue
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <LoginForm />
                        </CardContent>

                        <CardFooter className="justify-center pt-6 text-sm text-gray">
                            <span>
                                Don&apos;t have an account? <button className="font-semibold text-[#1f2937]">Sign up</button>
                            </span>
                        </CardFooter>
                    </Card>
                </section>

                <section className="relative hidden w-1/2 items-center justify-center pl-6 lg:flex">
                    <div className="relative h-[90vh] w-full max-w-[690px] overflow-hidden rounded-2xl bg-[#f6c067]">
                        <Image
                            src="/bg.png"
                            alt="Background visual"
                            fill
                            className="object-cover"
                            priority
                        />


                        <div
                            className={`absolute top-1/2 -translate-y-1/2 h-[70vh] w-full rounded-2xl border border-primary transition-[right] duration-700 ease-out ${imageLoaded ? "-right-20" : "-right-80"
                                }`}
                        >
                            <Image
                                src="/main.png"
                                alt="Main dashboard preview"
                                fill
                                className="object-cover object-left-top rounded-2xl"
                                priority
                            />
                        </div>
                    </div>
                </section>

            </div>
        </main>
    );
}
