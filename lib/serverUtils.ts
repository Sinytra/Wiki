'use server'

import fs from "fs";

export async function readLocalImage(file: any): Promise<string | null> {
  try {
    const bitmap = fs.readFileSync(file);
    return 'data:image/png;base64,' + Buffer.from(bitmap).toString('base64');
  } catch (e) {
    console.error(e);
    return null;
  }
}