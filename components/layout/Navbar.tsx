'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, FolderOpen, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const { t } = useLanguage();

  const isAdminPage = pathname.startsWith('/admin');
  const isAdmin = user?.role === 'admin';

  // Regular navigation for public/user pages
  const publicNavigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.tours'), href: '/tours' },
    { name: t('nav.about'), href: '/about' },
  ];

  // Admin navigation - only the pages we created
  const adminNavigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Categories', href: '/admin/categories' },
    { name: 'Tours', href: '/admin/tours' },
  ];

  const navigation = isAdminPage && isAdmin ? adminNavigation : publicNavigation;

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <nav className="bg-gradient-to-r from-white via-amber-50/30 to-white shadow-lg border-b border-amber-100/50 sticky top-0 z-50 backdrop-blur-md">
      <style jsx>{`
        @keyframes subtle-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(217, 119, 6, 0.1); }
          50% { box-shadow: 0 0 20px rgba(217, 119, 6, 0.2); }
        }
        .logo-glow {
          animation: subtle-glow 3s ease-in-out infinite;
        }
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.8);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="logo-glow px-3 py-2 rounded-xl">
              <div className="text-2xl font-light text-amber-900 tracking-wide group-hover:text-amber-700 transition-colors duration-300">
                <span className="font-serif italic">glowetsu</span>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-amber-600 to-amber-700 mt-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg ${
                  isActive(item.href)
                    ? 'text-amber-900 bg-amber-50 shadow-sm border border-amber-100'
                    : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50/50'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-amber-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher - Only show on public pages */}
            {!isAdminPage && (
              <div className="glass-effect px-3 py-2 rounded-lg border border-amber-100/50">
                <LanguageSwitcher />
              </div>
            )}
            
            {/* Cart - Only show on public pages */}
            {!isAdminPage && (
              <Link href="/cart" className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative hover:bg-amber-50 text-amber-700 hover:text-amber-900 transition-all duration-300 border border-transparent hover:border-amber-200 rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs bg-gradient-to-r from-amber-600 to-amber-700 text-white border-2 border-white shadow-lg">
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="glass-effect border border-amber-100/50 hover:bg-amber-50 text-amber-800 hover:text-amber-900 transition-all duration-300 rounded-lg"
                  >
                    <User className="h-5 w-5 mr-2" />
                    <span className="font-medium">{user.name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="glass-effect border border-amber-100 shadow-xl rounded-xl p-2 min-w-48"
                >
                  {/* Admin/User Navigation Toggle */}
                  {isAdmin && (
                    <>
                      {isAdminPage ? (
                        <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                          <Link href="/" className="flex items-center w-full">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            <span className="font-medium">Switch to User View</span>
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                          <Link href="/admin" className="flex items-center w-full">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            <span className="font-medium">{t('nav.admin')}</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-amber-100" />
                    </>
                  )}

                  {isAdminPage && (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                        <Link href="/admin/calender" className="flex items-center w-full font-medium">Calendar View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-amber-100" />
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                        <Link href="/admin/orders" className="flex items-center w-full font-medium">All Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-amber-100" />
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                        <Link href="/admin/categories" className="flex items-center w-full font-medium">Categories</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-amber-100" />
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                        <Link href="/admin/tours" className="flex items-center w-full font-medium">Tours</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-amber-100" />
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                        <Link href="/admin/users" className="flex items-center w-full font-medium">All Users</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-amber-100" />
                    </>
                  )}
                  
                  {/* User-specific options - only show on public pages */}
                  {!isAdminPage && (
                    <>
                      <DropdownMenuItem asChild className="rounded-lg hover:bg-amber-50 focus:bg-amber-50 text-amber-800">
                        <Link href="/orderhistory" className="flex items-center w-full font-medium">Order History</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-amber-100" />
                    </>
                  )}
                  
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="rounded-lg hover:bg-red-50 focus:bg-red-50 text-red-700 font-medium"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.signout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition-all duration-300 border border-transparent hover:border-amber-200 rounded-lg font-medium"
                >
                  <Link href="/auth/signin">{t('nav.signin')}</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-medium px-6"
                >
                  <Link href="/auth/signup">{t('nav.signup')}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-50 transition-colors rounded-lg"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-amber-100 bg-gradient-to-b from-white to-amber-50/30 rounded-b-xl">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 mx-2 ${
                    isActive(item.href)
                      ? 'text-amber-900 bg-amber-100 shadow-sm border border-amber-200'
                      : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Bottom Section */}
              <div className="pt-4 border-t border-amber-100 space-y-2 mx-2">
                {/* Cart - Only on public pages */}
                {!isAdminPage && (
                  <Link
                    href="/cart"
                    className="flex items-center px-4 py-3 text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    {t('nav.cart')} {itemCount > 0 && (
                      <Badge className="ml-2 bg-amber-600 text-white">
                        {itemCount}
                      </Badge>
                    )}
                  </Link>
                )}

                {/* Language Switcher - Only on public pages */}
                {!isAdminPage && (
                  <div className="px-4 py-3 bg-amber-50/50 rounded-lg border border-amber-100">
                    <div className="text-xs text-amber-600 mb-2 font-medium uppercase tracking-wide">Language</div>
                    <LanguageSwitcher />
                  </div>
                )}
                
                {user ? (
                  <div className="space-y-2">
                    {/* Admin Toggle */}
                    {isAdmin && (
                      <Link
                        href={isAdminPage ? "/" : "/admin"}
                        className="flex items-center px-4 py-3 text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-5 w-5 mr-3" />
                        {isAdminPage ? "Switch to User View" : t('nav.admin')}
                      </Link>
                    )}
                    
                    {/* Order History - Only on public pages */}
                    {!isAdminPage && (
                      <Link
                        href="/orders"
                        className="block px-4 py-3 text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-all duration-300"
                        onClick={() => setIsOpen(false)}
                      >
                        Order History
                      </Link>
                    )}
                    
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      {t('nav.signout')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-3 text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-all duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.signin')}
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 rounded-lg transition-all duration-300 shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.signup')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}