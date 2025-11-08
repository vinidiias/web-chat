"use client"

//EXTERNAL LIBRARIES
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

//TYPES
import { UserDTO } from "../@types/UserDTO";

//SOCKET
import { socket } from "@/socket";

type AuthContextProps = {
  isLogged: boolean;
  user: UserDTO | null;
  signIn: (data: UserDTO) => void;
  signOut: () => void;
};

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLogged, setIsLogged] = useState<boolean>(false);
  const [socketId, setSocketId] = useState<string | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);

      if(user) {
        setUser({ ...user, id: socket.id });
      }
    });

    return () => {
      socket.off("connect");
    }
  }, [user]);

  useEffect(() => {
    const token = Cookies.get("authToken");
    const username = Cookies.get("username");
    const photo = localStorage.getItem("userPhoto");

    if (token && username) {
      const userData: UserDTO = {
        id: socket.id,
        username,
        photo: photo || "",
      };
      setUser(userData);
      setIsLogged(true);

      socket.emit("join", userData);
    }
  }, []);

  const signIn = (data: UserDTO) => {
    Cookies.set("authToken", "authenticated", { expires: 7 });
    Cookies.set("username", data.username, { expires: 7 });

    localStorage.setItem("userPhoto", data.photo);

    setUser({ ...data, id: socket.id });
    setSocketId(socket.id);
    setIsLogged(true);

    socket.emit("join", data);
    router.push("/");
  };

  const signOut = () => {
    Cookies.remove("authToken");
    Cookies.remove("username");

    localStorage.removeItem("userPhoto");

    setUser(null);
    setSocketId(undefined);
    setIsLogged(false);

    socket.disconnect();
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ isLogged, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
