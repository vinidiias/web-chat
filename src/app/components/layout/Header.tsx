"use client";

//EXTERNAL LIBRARIES
import { useContext } from "react";
import { LogOut } from "lucide-react";

//UI COMPONENTS
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

//CONTEXT
import { AuthContext } from "@/app/context/AuthContext";

//INTERNAL COMPONENTS
import { ModeToggle } from "../ui/ModeThemeToggle";

export const Header = () => {
  const { user, isLogged } = useContext(AuthContext);
  const { username, photo } = user ?? {};

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-5">
        <ModeToggle />
        {isLogged && (
          <div className="flex items-center gap-1">
            <Avatar>
              <AvatarImage src={photo} alt="Photo" />
            </Avatar>
            <span className="text-sm tracking-tighter">{username}</span>
          </div>
        )}
      </div>
    </div>
  );
};
