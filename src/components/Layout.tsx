import { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

export const Layout = ({ children, showNav = true }: LayoutProps) => {
  const { themeConfig } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('codequest-role');
    localStorage.removeItem('codequest-language');
    navigate('/auth');
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${themeConfig.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
      
      {showNav && (
        <nav className="relative z-50 border-b border-border bg-card/50 backdrop-blur-md">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Home className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold bg-gradient-quest bg-clip-text text-transparent">
                CodeQuest
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              <ThemeSwitcher />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </nav>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
