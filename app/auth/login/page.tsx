"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/app/schemas/auth"
import { authClient } from "@/lib/auth-client"
import z from "zod"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTransition } from "react"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  function onSubmit(data: z.infer<typeof loginSchema>) {
    startTransition(async () => {
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        fetchOptions: {
          onSuccess: () => {
            toast.success("You have been signed in");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message);
          }
        }
      })
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller name="email" control={form.control} render={({ field, fieldState }) =>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="tonny@stark.com" {...field} type="email"></Input>
                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
              </Field>
            } />
            <Controller name="password" control={form.control} render={({ field, fieldState }) =>
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="********" {...field} type="password"></Input>
                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
              </Field>
            } />

            <Button type="submit" disabled={isPending}>{
              isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span className="sr-only">Loading...  </span>
                </>

              ) : <span>Login</span>

            }</Button>
          </FieldGroup>

        </form>
      </CardContent>
    </Card>
  )
}