import { useUser } from "@/app/useUser";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useAuthenticatedUser = () => {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.push("/");
    }
  }, [router, user]);
  return user as unknown as NonNullable<ReturnType<typeof useUser>>;
};
