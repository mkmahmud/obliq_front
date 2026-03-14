"use client";
import { ArrowRight, Eye } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export default function Login() {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        setImageLoaded(true);
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
                            <form className="space-y-5">
                                <div className="space-y-2.5">
                                    <Label htmlFor="email" className="text-sm font-medium text-[#646B78]">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        className="h-11 rounded-xl border-[#E7E8EB] bg-white text-sm"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="password" className="text-sm font-medium text-[#646B78]">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="h-11 rounded-xl border-[#E7E8EB] pr-11 text-sm"
                                        />
                                        <Eye className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#B6BBC6]" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 text-[#9AA0AB]">
                                        <Checkbox className="size-3.5   border-[#D6DAE2]" />
                                        <span>Remember me</span>
                                    </label>
                                    <button type="button" className="font-medium text-[#FF6A3D]">
                                        Forgot password?
                                    </button>
                                </div>

                                <Button className="  rounded-lg   border border-transparent bg-primary text-primary-foreground transition-colors hover:bg-white hover:text-primary hover:border-primary text-base py-5" >
                                    <span className="transition-transform duration-200 group-hover/button:-translate-x-[4px]">Log in </span> <ArrowRight className="size-4" />
                                </Button>
                            </form>
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
