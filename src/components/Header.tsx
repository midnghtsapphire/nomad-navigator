import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X, Globe, ChevronDown, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">NomadTax</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <div className="relative group">
              <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <a href="#experts" className="text-muted-foreground hover:text-foreground transition-colors">
              Experts
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-10 bg-muted animate-pulse rounded-md" />
            ) : user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>Log In</Button>
                <Button variant="hero" onClick={() => navigate('/auth')}>Start Free Trial</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a href="#features" className="text-foreground py-2">Features</a>
              <a href="#pricing" className="text-foreground py-2">Pricing</a>
              <a href="#resources" className="text-foreground py-2">Resources</a>
              <a href="#experts" className="text-foreground py-2">Experts</a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {loading ? (
                  <div className="w-full h-10 bg-muted animate-pulse rounded-md" />
                ) : user ? (
                  <>
                    <span className="text-sm text-muted-foreground py-2">
                      {user.email}
                    </span>
                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/auth')}>Log In</Button>
                    <Button variant="hero" className="w-full" onClick={() => navigate('/auth')}>Start Free Trial</Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
