'use server'

import {projectRegisterSchema} from "@/lib/forms/schemas";
import {revalidatePath} from "next/cache";

export async function handleEnableProjectForm(data: any) {
  const validatedFields = projectRegisterSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // TODO Get platform and slug from metadata file
  // const project = await platforms.getPlatformProject(validatedFields.data.source, validatedFields.data.slug)

  // TODO Validate ownership n' stuff
  // await database.enableProject(project.slug, project.name, project.source, validatedFields.data.source_url);
  revalidatePath('/dev');

  return { success: true, message: 'success' };
}