import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      // Give Superbase a short moment to finish the redirect handshake
      setTimeout(async () => {
        const { data: session } = await supabase.auth.getSession();

        if (session?.session) {
          navigate("/members");
        } else {
          navigate("/login");
        }
      }, 800);
    };

    handleSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div>Completing sign-in…</div>
    </div>
  );
};

export default AuthCallbackPage;
