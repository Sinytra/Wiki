import {revalidatePath, revalidateTag} from "next/cache";

function invalidateDocs(id: string) {
  revalidateTag('backend:' + id);

  revalidatePath(`/[locale]/(main)/project/${id}/[version]`, 'layout');
}

export default {
  invalidateDocs
};
