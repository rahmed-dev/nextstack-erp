// Ops log and snapshot management will live here.

export type OpsRecord = {
  id: string;
  created_at: string;
  doc_type: string;
  doc_id: string;
  operation: string;
  payload: unknown;
};

