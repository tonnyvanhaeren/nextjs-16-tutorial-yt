"use client";

import { Loader2, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comments";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";

export function CommentSection() {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<'posts'> }>()

  const createComment = useMutation(api.comments.createComment);

  const form = useForm({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      body: "",
      postId: params.postId,
    }
  })

  const onSubmit = (data: z.infer<typeof commentSchema>) => {
    startTransition(async () => {
      try {
        await createComment(data)
        form.reset()
        toast.success("Comment created successfully")
      } catch {
        toast.error("Failed to create comment")
      }
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-lg font-semibold">5 Comments</h2>
      </CardHeader>
      <CardContent >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>

          <Controller name="body" control={form.control} render={({ field, fieldState }) =>
            <Field>
              <FieldLabel>Body</FieldLabel>
              <Textarea aria-invalid={fieldState.invalid} placeholder="Share your thoughts" {...field}></Textarea>
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          } />

          <Button type="submit" disabled={isPending}> {
            isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span className="sr-only">Loading...</span>
              </>

            ) : <span>Add Comment</span>

          }</Button>
        </form>

      </CardContent>
    </Card>
  )
}