import type { Metadata } from "next";

import { LoginForm } from "@/components/admin/login-form";
import { brand } from "@/lib/commerce/business-config";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <p className="admin-login__eyebrow">{brand.name}</p>
        <h1>Admin Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
}
