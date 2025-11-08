//UI COMPONENTS
import { SidebarProvider } from "@/components/ui/sidebar";

//PROVIDERS
import { ThemeProvider } from "../components/ThemProvider"
import { AuthProvider } from "../context/AuthContext";

export const Provider = ({ children } : { children: React.ReactNode }) => {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <SidebarProvider>
          <AuthProvider>{children}</AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    );
}