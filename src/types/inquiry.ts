export interface RecruiterInquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  message: string;
  status: "new" | "reviewed";
  createdAt: string;
}
