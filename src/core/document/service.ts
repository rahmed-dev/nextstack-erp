// Central document service: all DocType CRUD flows through this layer.
// Hooks and lifecycle events will be wired here in later implementation.

import type { DocTypeDefinition } from "../doctypes";

export class DocumentService {
  constructor(private readonly registry: DocTypeDefinition[]) {}

  // Placeholder methods; implementation will call into Tauri/Rust and SQLite.
  async list(docTypeName: string) {
    void docTypeName;
    return { data: [], error: null as null | { code: string; message: string; details?: unknown } };
  }
}

export const documentService = new DocumentService([]);

