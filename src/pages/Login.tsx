export default function Login() {
  const handleGoogleLogin = () => {
    window.location.href =
      `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <img
            src="/codecelix-logo.png"
            alt="Codecelix"
            className="h-14 w-auto"
          />

          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Sign in with your Google account
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="h-5 w-5"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.193 36 24 36c-6.627 0-12-5.373-12-12S17.373 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.28 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.28 4 24 4c-7.682 0-14.347 4.337-17.694 10.691z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.178 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.144 35.091 26.676 36 24 36c-5.173 0-9.625-3.33-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303a12.05 12.05 0 01-4.084 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>

            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}