import React from "react";
import { Button } from "./ui/button";
import { LogIn, UserPlus } from "lucide-react";
import { getSession } from "@/lib/authentication";
import {AvatarPopover} from "./avatar";

const AuthButtons = async () => {
  const session = await getSession();
  const isLoggedIn = session?.isLoggedIn && session?.userId;
  return (
    <div className="hidden md:flex gap-4">
      {/* if not signed in */}
      {!isLoggedIn ? (
        <>
          <Button>
            <LogIn className="w-4 h-4 mr-2" />
            Sign In
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Sign Up
          </Button>
        </>
      ) : (
        <AvatarPopover name={session.name!} email={session.email!} />
      )}
    </div>
  );
};

export default AuthButtons;
