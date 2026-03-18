import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ShoppingBag, Menu, X, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function Layout({ children, currentPageName }) {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { 
    loadCart(); 
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("zookeepacart") || "[]");
    setCartCount(cart.reduce((s, i) => s + i.quantity, 0));
  };

  const handleLogout = () => logout(true);

  const role = user?.role;
  const isAdmin = role === "admin" || role === "super_admin";
  const isManager = role === "store_manager";
  const isSuspended = role === "suspended";

  // Suspended users — show minimal layout
  if (isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Account Suspended</h2>
          <p className="text-gray-500 text-sm mb-4">Your account has been suspended. Please contact support for assistance.</p>
          <Button variant="outline" onClick={handleLogout} className="rounded-none">Sign Out</Button>
        </div>
      </div>
    );
  }

  const navLinks = [
    { label: "Home", page: "Home" },
    { label: "Shop", page: "Shop" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Montserrat', sans-serif; }
        .brand-font { font-family: 'Cormorant Garamond', serif; }
        .nav-link { position: relative; }
        .nav-link::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 0; height: 1px; background: #D4AF37; transition: width 0.3s; }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
      `}</style>

      {/* Top banner */}
      <div className="bg-black text-white text-center text-xs py-2 tracking-widest uppercase">
        Free shipping on orders over R150 · Use code ZOOKEEPA10 for 10% off
      </div>

      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to={createPageUrl("Home")} className="flex flex-col items-center">
              <span className="brand-font text-2xl md:text-3xl font-bold tracking-widest text-black">ZOOKEEPA</span>
              <span className="text-xs tracking-[0.3em] text-yellow-600 uppercase font-light">Premium Clothing</span>
            </Link>

            {/* Desktop Nav — only show for customers & admins (not store managers) */}
            {!isManager && (
              <nav className="hidden md:flex items-center gap-8">
                {navLinks.map((l) => (
                  <Link key={l.label} to={createPageUrl(l.page)}
                    className={`nav-link text-sm tracking-widest uppercase text-gray-700 hover:text-black transition-colors ${currentPageName === l.page ? "active" : ""}`}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Store Manager nav */}
            {isManager && (
              <nav className="hidden md:flex items-center gap-8">
                <Link to={createPageUrl("StoreManager")} className={`nav-link text-sm tracking-widest uppercase text-gray-700 hover:text-black transition-colors ${currentPageName === "StoreManager" ? "active" : ""}`}>
                  Orders & Stock
                </Link>
              </nav>
            )}

            {/* Right Actions */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Admin Dashboard link */}
              {isAdmin && (
                <Link to={createPageUrl("SuperAdminDashboard")}>
                  <Button variant="ghost" size="sm" className="hidden md:flex gap-1 text-xs tracking-wider text-yellow-700 hover:text-yellow-900">
                    <Shield className="w-4 h-4" /> Admin
                  </Button>
                </Link>
              )}

              {user ? (
                <div className="flex items-center gap-1">
                  {!isManager && (
                    <Link to={createPageUrl("MyOrders")}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 md:w-9 md:h-9"><User className="w-4 h-4" /></Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon" className="w-8 h-8 md:w-9 md:h-9" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="text-xs tracking-wider" onClick={() => window.location.href = '/login'}>
                  Sign In
                </Button>
              )}

              {/* Cart — only for customers */}
              {!isManager && !isAdmin && (
                <Link to={createPageUrl("Cart")} className="relative">
                  <Button variant="ghost" size="icon" className="w-8 h-8 md:w-9 md:h-9">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
                    )}
                  </Button>
                </Link>
              )}
              {/* Admins also get cart */}
              {isAdmin && (
                <Link to={createPageUrl("Cart")} className="relative">
                  <Button variant="ghost" size="icon" className="w-8 h-8 md:w-9 md:h-9">
                    <ShoppingBag className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartCount}</span>
                    )}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            {!isManager && navLinks.map((l) => (
              <Link key={l.label} to={createPageUrl(l.page)} className="block text-sm tracking-widest uppercase text-gray-700 py-2" onClick={() => setMenuOpen(false)}>{l.label}</Link>
            ))}
            {isManager && (
              <Link to={createPageUrl("StoreManager")} className="block text-sm tracking-widest uppercase text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Orders & Stock</Link>
            )}
            {isAdmin && (
              <Link to={createPageUrl("SuperAdminDashboard")} className="block text-sm tracking-widest uppercase text-yellow-700 py-2" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
            )}
          </div>
        )}
      </header>

      <main>{children}</main>

      <footer className="bg-black text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="brand-font text-2xl font-bold tracking-widest mb-3">ZOOKEEPA</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Premium clothing for the bold and adventurous. Wear your wildside.</p>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to={createPageUrl("Home")} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">Home</Link></li>
                <li><Link to={createPageUrl("Shop")} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">Shop</Link></li>
                <li><Link to={createPageUrl("MyOrders")} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">My Orders</Link></li>
                <li><a href={createPageUrl("Home") + "#careers"} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">Careers</a></li>
                <li><a href={createPageUrl("Home") + "#contact"} className="text-sm text-gray-300 hover:text-yellow-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-widest uppercase text-gray-400 mb-4">Contact</h4>
              <p className="text-sm text-gray-400">hello@zookeepa.com</p>
              <p className="text-sm text-gray-400 mt-1">+27 11 555 0100</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-xs tracking-widest">
            © 2026 ZOOKEEPA · All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}