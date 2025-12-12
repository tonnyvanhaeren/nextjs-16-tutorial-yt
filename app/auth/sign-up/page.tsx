"use client"

import { signUpSchema } from "@/app/schemas/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export default function SignUpPage() {
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    }
  })

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-y-4">
            <Controller name="name" control={form.control} render={({ field, fieldState }) =>
              <Field>
                <FieldLabel>FullName</FieldLabel>
                <Input aria-invalid={fieldState.invalid} placeholder="Tonny Stark" {...field}></Input>
                {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
              </Field>
            } />
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

            <Button type="submit">Sign Up</Button>
          </FieldGroup>

        </form>
      </CardContent>
    </Card>
  )
}