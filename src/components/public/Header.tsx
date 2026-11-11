"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, Menu, X, Shield, ChevronRight } from "lucide-react";
import { NavigationItem } from "@/lib/types";
import { useCart } from "@/lib/cart/cart-context";

interface HeaderProps {
  navItems?: NavigationItem[];
  cartCount?: number;
}

export default function Header({
  navItems = [
    { id: "store", label: "Store", href: "/store" },
    { id: "mac", label: "Mac", href: "/mac" },
    { id: "ipad", label: "iPad", href: "/ipad" },
    { id: "iphone", label: "iPhone", href: "/iphone" },
    { id: "watch", label: "Watch", href: "/watch" },
    { id: "airpods", label: "AirPods", href: "/airpods" },
    { id: "accessories", label: "Accessories", href: "/accessories" },
    { id: "compare", label: "Compare", href: "/compare" },
    { id: "deals", label: "Deals", href: "/deals" },
  ],
  cartCount: initialCartCount = 0,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Safely consume dynamic cart count
  let liveCartCount = initialCartCount;
  try {
    const cart = useCart();
    liveCartCount = cart.cartCount;
  } catch {
    // If rendered outside CartProvider, fallback to initialCartCount
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "apple-nav-blur border-b border-white/10" : "apple-nav-blur"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between text-xs tracking-tight text-white/80 font-normal">
          {/* TroyX Typographic Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-1.5 group text-white hover:text-white transition-opacity"
            aria-label="TroyX iStore Home"
          >
            <span className="font-semibold tracking-tighter text-sm sm:text-base text-white">
              Troy<span className="font-light text-zinc-400">X</span>
            </span>
            <span className="text-[10px] tracking-wider uppercase font-medium px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
              iStore
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7" aria-label="Global Navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`transition-colors hover:text-white ${
                    isActive ? "text-white font-medium" : "text-white/70"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Header Actions (Search, Cart, Admin quick link, Mobile Toggle) */}
          <div className="flex items-center space-x-4 sm:space-x-5 text-white/80">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="hover:text-white transition-colors p-1"
              aria-label="Search TroyX iStore"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Cart Link */}
            <Link
              href="/cart"
              className="hover:text-white transition-colors relative p-1"
              aria-label={`Shopping Bag (${liveCartCount} items)`}
            >
              <ShoppingBag className="w-4 h-4" />
              {liveCartCount > 0 && (
                <span className="absolute -top-1 -right-1.5 bg-white text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {liveCartCount > 9 ? "9+" : liveCartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden hover:text-white transition-colors p-1"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {searchOpen && (
          <div className="border-t border-zinc-800 bg-black/95 px-4 py-4 backdrop-blur-md animate-fade-in">
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <Search className="w-4 h-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, models, or accessories..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-12 z-40 bg-black text-white px-6 py-8 flex flex-col justify-between overflow-y-auto animate-fade-in md:hidden">
          <div className="space-y-4">
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-semibold mb-2">
              Browse Categories
            </div>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center justify-between text-xl font-medium tracking-tight text-zinc-200 hover:text-white py-2 border-b border-zinc-900"
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </Link>
            ))}
          </div>

          <div className="pt-8 border-t border-zinc-900 space-y-4 text-sm text-zinc-400">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-zinc-200">TroyX iStore</span>
              <span className="text-xs">Bawaleshie, East Legon, Accra, Ghana</span>
              <span className="text-xs">Call: 0207137437 / 0548974717</span>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Home of Original Apple Products</span>
              <span className="text-[10px] text-zinc-500 font-mono">GH₵ Ghana Cedi</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
