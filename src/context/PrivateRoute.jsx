import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const PrivateRoute = ({ children, allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "https://service-request-form-backend-kcy2.onrender.com/api/auth/me",
          {
            withCredentials: true,
          }
        );
        const fetchedUser = res.data.user;
        setUser(fetchedUser);

        if (!allowedRoles.includes(fetchedUser.role)) {
          setUser(null); // unauthorized role
        }
      } catch (error) {
        setUser(null);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
