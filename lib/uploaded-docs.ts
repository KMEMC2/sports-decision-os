export type UploadedDocument = {
  id: string;
  name: string;
  department: "Scouting" | "Analytics" | "Medical" | "Contracts" | "Coaching" | "Operations";
  visibility: "Private" | "Front Office" | "Org-wide";
  content: string;
  addedAt: string;
};

export function uploadedDocumentsBlock(documents: UploadedDocument[]): string {
  if (!documents.length) return "No session documents were uploaded.";
  return documents
    .map(
      (document) =>
        `--- SESSION DOCUMENT (ID: ${document.id} | Department: ${document.department} | Visibility: ${document.visibility} | File: ${document.name}) ---\n${document.content}`
    )
    .join("\n\n");
}
