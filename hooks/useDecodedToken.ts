import { getDecodedToken } from "@/services/auth";
import { IUser } from "@/utils/jwtHelper";
import React, { useEffect } from "react";

export function useDecodedToken() {
  const [user, setUser] = React.useState<IUser | null>(null);
  useEffect(() => {
    getDecodedToken().then((r) => r && setUser(r));
  }, []);
  return user;
}