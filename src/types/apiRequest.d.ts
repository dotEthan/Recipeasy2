export interface SignatureRequest {
  operation: "upload" | "delete";
  publicId?: string;
}
