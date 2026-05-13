import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0F] px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        {/* Glow effect behind the sign-in card */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 opacity-20 blur-xl"></div>
        
        <div className="relative">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-[#111118] border border-white/5 shadow-2xl",
                headerTitle: "text-white font-bold",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton: "bg-[#1A1A25] border-white/10 text-white hover:bg-[#22223A] transition-colors",
                socialButtonsBlockButtonText: "text-white font-medium",
                formButtonPrimary: "bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 transition-opacity",
                footerActionLink: "text-violet-400 hover:text-violet-300",
                formFieldLabel: "text-slate-300",
                formFieldInput: "bg-[#1A1A25] border-white/10 text-white focus:border-violet-500/50 focus:ring-violet-500/20",
                dividerLine: "bg-white/5",
                dividerText: "text-slate-500",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-violet-400",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
