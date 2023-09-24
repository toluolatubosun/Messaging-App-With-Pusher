import React, { useEffect } from "react";
import type { NextPage } from "next";

import { withAuth } from "../../utils";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { Loading } from "../../components";

const Logout: NextPage = () => {
    const router = useRouter();

    useEffect(() => {
        setCookie("access_token", "", { expires: new Date(0) });
        router.replace("/");
    }, []);

    return (
        <>
            <div className="h-full pt-12">
                <h1 className="text-5xl text-center font-Sora font-bold tracking-wider text-primary">Logging You Out</h1>

                <Loading isParent={true} />
            </div>
        </>
    );
};

export default withAuth(Logout);
