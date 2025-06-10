'use server'
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export const setUserRole = async (formData) => {
  const { userId } = await auth();
  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  if (!user) {
    return {
      error: "User not found",
    };
  }
  const role = formData.get("role");

  if (!role || !["PATIENT", "DOCTOR"].includes(role)) {
    return {
      error: "Invalid role",
    };
  }

  try {
    if (role === "PATIENT") {
      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "PATIENT",
        },
      });
      revalidatePath("/");
      return {
        success: true,
        redirect: "/docters",
      };
    }
    if (role === "DOCTOR") {
      const specialty = formData.get("specialty");
      const experience = parseInt(formData.get("experience"), 10);
      const credentialUrl = formData.get("credentialUrl");
      const description = formData.get("description");

      if (!specialty || !experience || !credentialUrl || !description) {
        throw new Error("All fields are required");
      }
      await db.user.update({
        where: {
          clerkUserId: userId,
        },
        data: {
          role: "DOCTOR",
          specialty,
          experience,
          credentialUrl,
          description,
          verificationStatus: "PENDING",
        },
      });
      revalidatePath("/");
      return {
        success: true,
        redirect: "/doctor/verification",
      };
    }
  } catch (error) {
    return {
      error: "Failed to update user role",
    };
  }
};

export const getCurrentUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });
  return user;
};