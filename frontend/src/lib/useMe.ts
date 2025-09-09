"use client";
import { useEffect, useState } from "react";
import type { CurrentUser } from "./auth";
import { getMe } from "./auth";

export function useMe() {
  const [user, setUser] = useState<CurrentUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancel) setUser(me);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => { cancel = true; };
  }, []);

  return { user, loading };
}
