import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { UploadVideo } from "@/components/dashboard/UploadVideo";

export default async function DashboardPage() {
  console.log("Checking Clerk Secret Key:", !!process.env.CLERK_SECRET_KEY);
  
  let user;
  try {
    user = await currentUser();
  } catch (error: any) {
    console.error("Clerk Error Detailed:", error);
    throw error;
  }

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-12">
      {/* Hero Upload Section */}
      <section className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-heading font-black text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="text-primary font-bold">{user.firstName}</span>. What are we creating today?
          </p>
        </div>
        
        <UploadVideo />
      </section>

    </div>
  );
}
