"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const data = useQuery(api.posts.getPosts);
  console.log(data);
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insights, thoughts, and ideas</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((post) => (

          <Card className="pt-0" key={post._id}>
            <div className="relative h-48 w-full overflow-hidden rounded-t-lg ">
              <Image src="https://images.unsplash.com/photo-1692087460128-da4bc008931c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="foto" fill className="object-cover" />
            </div>
            <CardContent>
              <Link href={`/blog/${post._id}`}>
                <h1 className="text-2xl font-semibold text-primary">{post.title}</h1>
              </Link>
              <p className="text-muted-foreground line-clamp-3">{post.body}</p>
            </CardContent>
            <CardFooter>
              <Link className={buttonVariants({ className: "w-full", variant: "default" })} href={`/blog/${post._id}`}>
                Read more
              </Link>
            </CardFooter>
          </Card>

        ))}
      </div>
    </div>
  );
}