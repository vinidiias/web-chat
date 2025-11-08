//EXTERNAL LIBRARIES
import { Fragment, useContext } from "react";
import { LogOut } from "lucide-react";

//TYPES
import { UserDTO } from "@/app/@types/UserDTO";

//UI COMPONENTS
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar as SiderbarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

//CONTEXT
import { AuthContext } from "@/app/context/AuthContext";

interface SiderbarProps {
  activeUsers: UserDTO[];
  handleClick: (id: string) => void;
  selectedUserId?: string | null;
}

export const Sidebar = ({ activeUsers, handleClick, selectedUserId }: SiderbarProps) => {
  const { user, signOut } = useContext(AuthContext);

  return (
    <SiderbarContainer>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Friend List</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {activeUsers
                .filter((u) => u.id !== user?.id)
                .map((friendUser, i) => (
                  <Fragment key={friendUser.id}>
                    <SidebarMenuItem key={friendUser.id}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => handleClick(friendUser.id ?? "")}
                        isActive={selectedUserId === friendUser.id}
                      >
                        <div>
                          <Avatar>
                            <AvatarImage src={friendUser.photo} />
                          </Avatar>
                          <span>{friendUser.username}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {i !== activeUsers.length - 1 && <SidebarSeparator />}
                  </Fragment>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="ml-auto px-5">
        <Button variant="ghost" size="icon" onClick={signOut}>
          Sair
          <LogOut />
        </Button>
      </SidebarFooter>
    </SiderbarContainer>
  );
};
