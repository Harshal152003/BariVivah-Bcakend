// src/app/(auth)/admin-login/page.jsx
import AdminLoginForm from "./form";
import AuthBanner from "@/components/AuthBanner";

export default function AdminLoginPage() {
  return (
    <div className="h-screen flex overflow-hidden bg-[#FFFFFF]">
      {/* Right side - Banner */}
      <AuthBanner />
      
      {/* Left side - Form */}
      <div className="w-full sm:w-full md:w-1/2 flex items-center justify-center p-8">
        <AdminLoginForm />
      </div>
    </div>
  );
}
