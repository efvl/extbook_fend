'use server';

import { revalidatePath } from "next/cache";

const BACKEND_URL = process.env.BACKEND_URL!;

export async function createLanguage(formData: FormData) {
  const payload = {
    id: crypto.randomUUID(),
    shortName: formData.get("shortName"),
    fullName: formData.get("fullName"),
  };

  const res = await fetch(`${BACKEND_URL}/v1/lang`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create language");
  }

  revalidatePath("/ui/dashboard");
}

export async function updateLanguage(id: string, formData: FormData) {
  const payload = {
    id,
    shortName: formData.get("shortName"),
    fullName: formData.get("fullName"),
  };

  const res = await fetch(`${BACKEND_URL}/v1/lang/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to update language");
  }

  revalidatePath("/ui/dashboard");
}

export async function deleteLanguage(id: string) {
  const res = await fetch(`${BACKEND_URL}/v1/lang/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to delete language");
  }

  revalidatePath("/ui/dashboard");
}