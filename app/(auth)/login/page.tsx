import { Eye } from "lucide-react";

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

export default function Login() {
    return (
        <main className="min-h-screen bg-[#E8E8E8] p-4 sm:p-6 lg:p-8">
            <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1380px] rounded-none bg-[#f3f3f3] p-6 sm:min-h-[calc(100vh-3rem)] sm:p-8 lg:p-10">
                <div className="absolute top-7 left-7 flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-md bg-[#FF7A3E]">
                        <span className="text-sm font-bold text-white">o</span>
                    </div>
                    <span className="text-[26px] font-semibold tracking-tight text-[#2f2f2f]">Obliq</span>
                </div>

                <section className="flex w-full items-center justify-center lg:w-1/2">
                    <Card className="w-full max-w-[410px] rounded-3xl border border-[#EDEDED] bg-[#FCFCFC] px-8 py-8 shadow-[0_12px_30px_rgba(16,24,40,0.06)]">
                        <CardHeader className="pb-7 text-center">
                            <CardTitle className="text-[38px] font-semibold">Login</CardTitle>
                            <CardDescription className="text-[15px] text-[#B2B6BF]">
                                Enter your details to continue
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form className="space-y-5">
                                <div className="space-y-2.5">
                                    <Label htmlFor="email" className="text-[13px] font-medium text-[#646B78]">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="example@email.com"
                                        className="h-11 rounded-xl border-[#E7E8EB] bg-white text-[13px]"
                                    />
                                </div>

                                <div className="space-y-2.5">
                                    <Label htmlFor="password" className="text-[13px] font-medium text-[#646B78]">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Enter your password"
                                            className="h-11 rounded-xl border-[#E7E8EB] pr-11 text-[13px]"
                                        />
                                        <Eye className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-[#B6BBC6]" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[13px]">
                                    <label className="flex items-center gap-2 text-[#9AA0AB]">
                                        <Checkbox className="size-3.5 rounded-sm border-[#D6DAE2]" />
                                        <span>Remember me</span>
                                    </label>
                                    <button type="button" className="font-medium text-[#FF6A3D]">
                                        Forgot password?
                                    </button>
                                </div>

                                <Button className="mt-1 h-11 rounded-xl bg-[#FF6A3D] text-[14px] font-medium shadow-[0_8px_18px_rgba(255,106,61,0.35)] hover:bg-[#f86333]">
                                    Log in
                                </Button>
                            </form>
                        </CardContent>

                        <CardFooter className="justify-center pt-6 text-[14px] text-[#9EA3AE]">
                            <span>
                                Don&apos;t have an account? <button className="font-semibold text-[#1f2937]">Sign up</button>
                            </span>
                        </CardFooter>
                    </Card>
                </section>

                <section className="relative hidden w-1/2 items-center justify-center pl-6 lg:flex">
                    <div className="relative h-[710px] w-full max-w-[690px] overflow-hidden rounded-2xl bg-[#f6c067]">
                        <div className="absolute inset-0 bg-[radial-gradient(120%_95%_at_20%_15%,#ff7d36_0%,#ff6933_18%,transparent_45%),radial-gradient(120%_85%_at_90%_10%,#f1bb6a_0%,#efb46a_26%,transparent_52%),radial-gradient(130%_90%_at_10%_58%,#f8ae43_0%,#f0b455_28%,transparent_52%),radial-gradient(120%_80%_at_96%_48%,#ea6b3d_0%,#de5f39_22%,transparent_50%),radial-gradient(130%_100%_at_20%_100%,#f0a244_0%,#e48649_32%,transparent_55%),radial-gradient(120%_100%_at_95%_97%,#a94e44_0%,#8f3f40_42%,transparent_65%)]" />

                        <div className="absolute top-[96px] right-[24px] h-[530px] w-[225px] rounded-2xl border border-[#EAE6DE] bg-[#F7F3EC] p-3 shadow-[0_12px_24px_rgba(25,25,25,0.08)]">
                            <div className="mb-2 h-2.5 w-14 rounded bg-[#E2DDD3]" />
                            <div className="space-y-2.5">
                                <div className="h-8 rounded-md bg-[#ECE7DF]" />
                                <div className="h-7 rounded-md bg-[#EFEAE2]" />
                                <div className="h-7 rounded-md bg-[#EFEAE2]" />
                                <div className="h-7 rounded-md bg-[#EFEAE2]" />
                            </div>
                            <div className="mt-5 space-y-2">
                                <div className="h-2.5 w-16 rounded bg-[#DDD7CE]" />
                                <div className="h-7 rounded-md bg-[#ECE7DF]" />
                                <div className="h-7 rounded-md bg-[#ECE7DF]" />
                                <div className="h-7 rounded-md bg-[#ECE7DF]" />
                                <div className="h-7 rounded-md bg-[#ECE7DF]" />
                            </div>
                            <div className="mt-5 space-y-2">
                                <div className="h-2.5 w-12 rounded bg-[#DDD7CE]" />
                                <div className="h-16 rounded-md bg-[#ECE7DF]" />
                                <div className="h-16 rounded-md bg-[#ECE7DF]" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
