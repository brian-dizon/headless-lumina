"use server";

import { getClient } from "@/lib/apollo-client";
import { getAuthToken } from "@/lib/auth";
import { CREATE_LEAD_MUTATION } from "@/lib/graphql/mutations";
import { z } from "zod";

/**
 * 1. Validation Schema (Zod)
 * Defines the 'Server-Side Truth' for what a valid submission looks like.
 */
const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type FormState = {
  success?: boolean;
  error?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

/**
 * 2. Submit Lead Server Action
 * This function runs ONLY on the server.
 */
export async function submitLead(prevState: FormState, formData: FormData): Promise<FormState> {
  // Extract data from form
  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  };

  // 3. Server-Side Validation
  const validatedFields = ContactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, message } = validatedFields.data;

  // 4. WordPress Integration
  try {
    const authToken = getAuthToken();
    if (!authToken) throw new Error("Server configuration error: Auth token missing.");

    await getClient(authToken).mutate({
      mutation: CREATE_LEAD_MUTATION,
      variables: {
        title: `Lead: ${name}`,
        content: `Email: ${email}\n\nMessage: ${message}`,
      },
    });

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit inquiry.";
    console.error("Mutation Error:", errorMessage);
    return { 
      error: "Failed to submit inquiry. Please try again later." 
    };
  }
}
