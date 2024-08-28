'use server'

import fs from "fs";

export async function readLocalImage(file: any): Promise<string> {
  const bitmap = fs.readFileSync(file);
  try {
    return 'data:image/png;base64,' + Buffer.from(bitmap).toString('base64');
  } catch (e) {
    return 'nonexistent';
  }
}