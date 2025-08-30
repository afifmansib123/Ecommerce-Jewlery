'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from 'lucide-react';
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
    { name: 'Collection', href: '/admin/products' },
  ];

  const navigation = isAdminPage && isAdmin ? adminNavigation : publicNavigation;

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="flex items-center">
              <div className="text-2xl font-light text-stone-900 tracking-wide group-hover:text-stone-700 transition-colors duration-200">
                <span className="font-serif">Wangmanee</span>
                <span className="font-light ml-2 text-stone-600">Gallery</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative text-sm font-medium transition-all duration-200 px-4 py-2 rounded-sm ${
                  isActive(item.href)
                    ? 'text-stone-900 bg-stone-100'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {item.name}
                {isActive(item.href) && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-900"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Language Switcher - Only show on public pages */}
            {!isAdminPage && (
              <div className="border-l border-stone-200 pl-6">
                <LanguageSwitcher />
              </div>
            )}
            
            {/* Cart - Only show on public pages */}
            {!isAdminPage && (
              <Link href="/cart" className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors duration-200 p-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-stone-900 text-white border border-white">
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
                    className="hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-colors duration-200 border border-stone-200 rounded-sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="font-medium text-sm">{user.name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end"
                  className="border border-stone-200 shadow-lg rounded-sm p-1 min-w-48 bg-white"
                >
                  {/* Admin/User Navigation Toggle */}
                  {isAdmin && (
                    <>
                      {isAdminPage ? (
                        <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                          <Link href="/" className="flex items-center w-full">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            <span className="text-sm">Switch to Gallery</span>
                          </Link>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                          <Link href="/admin" className="flex items-center w-full">
                            <LayoutDashboard className="h-4 w-4 mr-2" />
                            <span className="text-sm">{t('nav.admin')}</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-stone-200" />
                    </>
                  )}

                  {isAdminPage && (
                    <>
                      <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                        <Link href="/admin/calendar" className="flex items-center w-full text-sm">Calendar</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-stone-200" />
                      <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                        <Link href="/admin/orders" className="flex items-center w-full text-sm">Orders</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-stone-200" />
                      <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                        <Link href="/admin/categories" className="flex items-center w-full text-sm">Categories</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-stone-200" />
                      <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                        <Link href="/admin/products" className="flex items-center w-full text-sm">Collection</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-stone-200" />
                      <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                        <Link href="/admin/users" className="flex items-center w-full text-sm">Users</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-stone-200" />
                    </>
                  )}
                  
                  {/* User-specific options - only show on public pages */}
                  {!isAdminPage && (
                    <>
                      <DropdownMenuItem asChild className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700">
                        <Link href="/orderhistory" className="flex items-center w-full text-sm">Order History</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-stone-200" />
                    </>
                  )}
                  
                  <DropdownMenuItem 
                    onClick={signOut}
                    className="rounded-none hover:bg-stone-50 focus:bg-stone-50 text-stone-700 text-sm"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('nav.signout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3 border-l border-stone-200 pl-6">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  asChild
                  className="text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-200 text-sm font-medium"
                >
                  <Link href="/auth/signin">{t('nav.signin')}</Link>
                </Button>
                <Button 
                  size="sm" 
                  asChild
                  className="bg-stone-900 hover:bg-stone-800 text-white transition-colors duration-200 text-sm font-medium px-4 rounded-sm"
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
              className="text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-stone-200 bg-white">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'text-stone-900 bg-stone-100 border-l-2 border-stone-900'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Bottom Section */}
              <div className="pt-4 border-t border-stone-200 space-y-1">
                {/* Cart - Only on public pages */}
                {!isAdminPage && (
                  <Link
                    href="/cart"
                    className="flex items-center px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    {t('nav.cart')} {itemCount > 0 && (
                      <Badge className="ml-2 bg-stone-900 text-white text-xs">
                        {itemCount}
                      </Badge>
                    )}
                  </Link>
                )}

                {/* Language Switcher - Only on public pages */}
                {!isAdminPage && (
                  <div className="px-4 py-3 bg-stone-50 border-t border-stone-200">
                    <div className="text-xs text-stone-500 mb-2 font-medium uppercase tracking-wide">Language</div>
                    <LanguageSwitcher />
                  </div>
                )}
                
                {user ? (
                  <div className="space-y-1 border-t border-stone-200 pt-2">
                    {/* Admin Toggle */}
                    {isAdmin && (
                      <Link
                        href={isAdminPage ? "/" : "/admin"}
                        className="flex items-center px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-200"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="h-5 w-5 mr-3" />
                        {isAdminPage ? "Switch to Gallery" : t('nav.admin')}
                      </Link>
                    )}
                    
                    {/* Order History - Only on public pages */}
                    {!isAdminPage && (
                      <Link
                        href="/orders"
                        className="block px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-200"
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
                      className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-200"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      {t('nav.signout')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1 border-t border-stone-200 pt-2">
                    <Link
                      href="/auth/signin"
                      className="block px-4 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.signin')}
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block mx-4 my-2 px-4 py-3 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 transition-colors duration-200 text-center rounded-sm"
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