import { getDecodedToken } from "@/services/auth";
import { DecodedToken } from "@/utils/jwtHelper";
import React, { useEffect } from "react";

export function useDecodedToken(){
    const [user, setUser] = React.useState<DecodedToken | null>(null);
      useEffect(() => {
        getDecodedToken().then((r) => r && setUser(r));
      }, []);
      return user;
}