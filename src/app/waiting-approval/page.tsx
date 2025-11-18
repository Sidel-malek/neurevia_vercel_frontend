"use client"
export default function WaitingApprovalPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Your account is pending approval</h2>
        <p className="text-gray-600 mb-6">
          We are verifying your information. You will receive an email once your account is approved.
        </p>
        <button 
          onClick={() => window.location.href = "/auth"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
