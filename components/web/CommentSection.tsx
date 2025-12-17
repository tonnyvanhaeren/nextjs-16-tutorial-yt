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
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import z from "zod";
import { toast } from "sonner";
import { useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function CommentSection(props: { preloadedComments: Preloaded<typeof api.comments.getCommentsByPostId> }) {
  const [isPending, startTransition] = useTransition();
  const params = useParams<{ postId: Id<'posts'> }>()

  const comments = usePreloadedQuery(props.preloadedComments)
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

  if (comments === undefined) {
    return <p>loading ...</p>
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-lg font-semibold">{comments.length} Comments</h2>
      </CardHeader>
      <CardContent className="space-y-8">
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

        {comments?.length > 0 && <Separator className="my-8" />}

        <section className="space-y-6">
          {comments?.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${comment.authorName}`}
                  alt={comment.authorName} />
                <AvatarFallback>{comment.authorName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xs">{comment.authorName}</p>
                  <p className="text-xs text-muted-foreground">{new Date(comment._creationTime).toLocaleDateString("nl-BE")}</p>
                </div>
                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed  ">{comment.body}</p>
              </div>
            </div>
          ))}

        </section>
      </CardContent>
    </Card>
  )
}