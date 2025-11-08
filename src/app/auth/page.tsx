//INTERNAL COMPONENTS
import { Header } from "../components/layout/Header";
import { FormAuth } from "../components/pages/auth/FormAuth";

export default async function AuthPage () {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <div className="absolute top-2 right-2">
        <Header />
      </div>
      <div className="w-full max-w-md p-8 rounded-lg shadow-md dark:bg-neutral-900">
        <FormAuth />
      </div>
    </div>
  );
};