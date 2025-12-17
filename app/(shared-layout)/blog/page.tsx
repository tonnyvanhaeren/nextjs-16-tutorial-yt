import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";

//export const dynamic = 'force-static';
// 'auto' ||  'force-dynamic' || 'error' || 'force-static'

//export const revalidate = 60;
// false || 0 || number

export const metadata: Metadata = {
  title: 'Blog | Next js tutorial',
  description: 'Read our latest blog posts',
  category: 'Web development',
  authors: [
    {
      name: 'Antonius Vanhaeren',
    },
  ],
}

export default function BlogPage() {
  return (
    <div className="py-12">
      <div className="text-center pb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our Blog
        </h1>
        <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insights, thoughts, and ideas</p>
      </div>
      <div>
        <LoadBlogList />
        {/* <Suspense fallback={<SkeletonLoadingUi />}>
          <LoadBlogList />
        </Suspense> */}
      </div>
    </div>
  );
}

async function LoadBlogList() {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  // await connection()
  "use cache"
  cacheLife("hours")
  cacheTag("blog")

  const data = await fetchQuery(api.posts.getPosts);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map((post) => (
        <Card className="pt-0" key={post._id}>
          <div className="relative h-48 w-full overflow-hidden rounded-t-lg ">
            <Image src={post.imageUrl ?? 'https://images.unsplash.com/photo-1692087460128-da4bc008931c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt="foto" fill className="object-cover" />
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

  )
}

function SkeletonLoadingUi() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="space-y-2 flex flex-col">
            <Skeleton className="h-6 w-3/4 bg-primary" />
            <Skeleton className="h-6 w-full bg-yellow-500" />
            <Skeleton className="h-10 w-full bg-primary" />
          </div>
        </div>
      ))}
    </div >
  )
}