"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login, signup } from "@/actions/auth";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  email: z.string().email("Invalid Email!"),
  password: z.string().min(2, {
    message: "Incorrect Password!",
  }),
});

export function AuthForm({ authPage }: { authPage: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    error: "",
    success: "",
  });

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setMessage({ error: "", success: "" });
    let result = {
      success: false,
      message: ""
    }

    if(authPage === "login") {
      result = await login(values);
      router.push("/notes")
    } else {
      result = await signup(values);
      router.push("/notes/new");
    }

    if (!result.success) {
      setMessage({ error: result.message, success: "" });
    } else {
      setMessage({ error: "", success: result.message });
    }

    setLoading(false);
  }

  return (
    <Card className="w-[90%] mx-auto max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{authPage === "login" ? "Login": "Register"}</CardTitle>
        <CardDescription>
          {message.success ? (
            <p className="text-center text-green-600">{message.success}</p>
          ) : (
            <p className="text-center text-destructive">{message.error}</p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-5 font-mono text-lg"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-semibold">
              {loading ? (
                <Loader className="animate-spin" />
              ) : authPage === "login" ? (
                "Login"
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {authPage === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
