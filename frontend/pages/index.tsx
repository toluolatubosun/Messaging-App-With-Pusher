import React from "react";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
    return (
        <>
            <div className="h-full pt-12">
                <h1 className="text-5xl text-center font-Sora font-bold tracking-wider text-primary">Welcome To Messaging App</h1>

                <div className="flex flex-col items-center mt-16 text-2xl tracking-wider space-y-10 font-semibold text-white">
                    <Link href="/auth/login">
                        <a className="border-4 py-3 px-20 hover:border-primary">[ login ] Gain Access</a>
                    </Link>

                    <Link href="/auth/register">
                        <a className="border-4 py-3 px-20 hover:border-primary">[ Register ] Click Here if you don't have an account</a>
                    </Link>

                    <Link href="/app/find-users">
                        <a className="border-4 py-3 px-20 hover:border-primary">[ Find User ] See users you can chat with</a>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Home;
