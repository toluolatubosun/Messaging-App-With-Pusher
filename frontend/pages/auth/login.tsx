import React from "react";
import type { NextPage } from "next";

import { withoutAuth } from "../../utils";
import { CardLayout, InputField } from "../../components";
import { toast } from "react-toastify";
import { AxiosError, AxiosResponse } from "axios";
import { authLogin } from "../../api";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

const Login: NextPage = () => {
    const router = useRouter();
    
    const HandleSubmit = (e: any) => {
        e.preventDefault();

        toast.loading("Loading... Please wait", {
            autoClose: false
        });

        mutate(formData);
    };

    const { mutate, isLoading } = useMutation(authLogin, {
        onSuccess: (response: AxiosResponse) => {
            toast.dismiss();
            toast.success("Login Successful");

            setCookie("access_token", response.data.data.token);

            router.push("/app/find-users");
        },
        onError: (error: AxiosError) => {
            toast.dismiss();
            toast.error(error.response ? error.response.data.message : error.message);
        }
    });

    const [formData, setFormData] = React.useState({
        email: "",
        password: ""
    });

    return (
        <>
            <div className="h-full pt-12">
                <h1 className="text-5xl text-center font-Sora font-bold tracking-wider text-primary">Login Page</h1>

                <CardLayout>
                    <form id="loginForm" className="mb-0 space-y-6" method="POST" onSubmit={HandleSubmit}>
                        <InputField
                            label="Email Address"
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                            type="email"
                            required={true}
                            name="email"
                        />

                        <InputField
                            label="Password"
                            value={formData.password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                            type="password"
                            required={true}
                            name="password"
                        />

                        <div>
                            <button
                                disabled={isLoading}
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 rounded shadow-sm text-md font-semibold text-white bg-primary hover:bg-secondary mt-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </CardLayout>
            </div>
        </>
    );
};

export default withoutAuth(Login);
