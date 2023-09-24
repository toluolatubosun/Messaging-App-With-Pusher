import React from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

import { withAuth } from "../../utils";
import { usersFindUsers } from "../../api";
import { CardLayout } from "../../components";

import type { NextPage } from "next";
import type { AxiosError, AxiosResponse } from "axios";

const FindUser: NextPage = () => {
    const [users, setUsers] = React.useState([]);

    useQuery(["users"], usersFindUsers, {
        onSuccess: (response: AxiosResponse) => {
            setUsers(response.data.data);
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    return (
        <>
            <div className="h-full pt-12">
                <h1 className="text-5xl text-center font-Sora font-bold tracking-wider text-primary">Find Users Page</h1>

                {users.length === 0 ? (
                    <CardLayout>
                        <h1 className="text-3xl text-center font-Sora font-bold tracking-wider text-primary">No Users Found</h1>
                    </CardLayout>
                ) : (
                    <div className="flex flex-col items-center mt-16 text-3xl tracking-wider space-y-10 font-semibold px-20 lg:px-52">
                        {users.map((user: any) => (
                            <div key={user._id} className="bg-white rounded-sm text-primary w-full text-center py-4">
                                <Link href={`/app/chat?userId=${user._id}`}>
                                    <a>Name: {user.name}</a>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default withAuth(FindUser);
