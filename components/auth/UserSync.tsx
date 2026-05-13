import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { Users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function UserSync() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // Check if user already exists in our database
    console.log(`Checking for existing user: ${user.id}`);
    const results = await db.select()
      .from(Users)
      .where(eq(Users.clerkId, user.id))
      .limit(1);
    
    const existingUser = results[0];

    const email = user.emailAddresses[0]?.emailAddress;
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const imageUrl = user.imageUrl;

    if (!existingUser) {
      // Create new user record
      console.log(`Creating new user in DB: ${user.id}`);
      await db.insert(Users).values({
        clerkId: user.id,
        email: email,
        name: name,
        imageUrl: imageUrl,
      });
    } else {
      // Optional: Update user info if it changed
      // This ensures our DB stays in sync with Clerk without webhooks
      if (existingUser.email !== email || existingUser.name !== name || existingUser.imageUrl !== imageUrl) {
        console.log(`Updating user info in DB: ${user.id}`);
        await db.update(Users)
          .set({
            email: email,
            name: name,
            imageUrl: imageUrl,
            updatedAt: new Date(),
          })
          .where(eq(Users.clerkId, user.id));
      }
    }
  } catch (error) {
    console.error("Error syncing user to database:", error);
  }

  return null;
}
