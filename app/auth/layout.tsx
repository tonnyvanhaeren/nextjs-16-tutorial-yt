import { buttonVariants } from "@/components/ui/button";
import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="absolute left-5 top-5">
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          <ArrowBigLeft className="size-4" />
          Go Back
        </Link>
      </div>
      <div className="w-full max-w-md mx-auto">
        {children}
      </div>
    </div>
  )
}