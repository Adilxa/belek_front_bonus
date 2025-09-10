import VerificationForm from "@/components/features/auth/VerificationForm";
import { Suspense } from "react";

export default function VerificationPage() {
   return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationForm />
    </Suspense>
  );
}