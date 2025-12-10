// Audit and versioning helpers.

export type AuditEntry = {
  id: string;
  doc_type: string;
  doc_id: string;
  action: string;
  changed_at: string;
  changed_by: string;
  summary: string;
};

