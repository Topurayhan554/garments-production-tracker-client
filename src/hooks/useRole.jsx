import { useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  useEffect(() => {
    if (!user?.email || loading) {
      setRoleLoading(false);
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await axiosSecure.get(`/users/email/${user.email}`);
        setRole(res.data.user?.role || "buyer");
      } catch (error) {
        console.error("Failed to fetch role:", error);
        setRole("buyer");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user?.email, loading]);

  return { role, roleLoading };
};

export default useRole;
