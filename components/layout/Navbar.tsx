import React, { useState } from "react";
import {
  BookMarked,
  Plus,
  LogOut,
  User,
  Library,
  Sparkles,
} from "lucide-react";
import { UserProfile } from "@/lib/mockData";

interface NavbarProps {
  user: UserProfile | null;
  onOpenAddModal: () => void;
  onLogout: () => void;
  onLoginClick: () => void;
  totalBooksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAddModal,
  onLogout,
  onLoginClick,
  totalBooksCount,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#FBF9F6]/90 backdrop-blur-md border-b border-[#EBE5DA] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D2A26] text-[#FBF9F6] flex items-center justify-center shadow-xs">
            <BookMarked className="w-5 h-5 stroke-[1.75]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2D2A26]">
                The Reader's Shelf
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-[#EFE8DC] text-[#655848] rounded-md border border-[#E2DACB]">
                Personal
              </span>
            </div>
            <p className="text-[11px] text-[#8C8275] hidden md:block">
              Minimalist, editorial reading space
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Add Book Button */}
          <button
            onClick={onOpenAddModal}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 bg-[#2D2A26] hover:bg-[#1A1816] text-[#FBF9F6] rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs flex items-center gap-2 cursor-pointer group"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            <span className="hidden sm:inline">Add Book</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* User Profile / Auth Toggle */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-[#E5DFC9] bg-[#FAF8F5] hover:bg-[#F3EDE2] transition-colors cursor-pointer"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#2D2A26]/10"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#EAE4DC] text-[#2D2A26] flex items-center justify-center font-medium text-xs">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-semibold text-[#2D2A26] hidden md:inline-block max-w-[120px] truncate">
                  {user.name}
                </span>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-[#FAF8F5] border border-[#E5DFC9] rounded-2xl shadow-lg p-3 z-50 animate-fadeIn">
                    <div className="px-3 py-2 border-b border-[#EBE5DA] mb-2">
                      <p className="text-xs font-bold text-[#2D2A26] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[#8C8275] truncate">
                        {user.email}
                      </p>
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#655848] font-medium bg-[#EFE8DC]/80 px-2 py-1 rounded-md">
                        <Library className="w-3.5 h-3.5" />
                        <span>{totalBooksCount} books on shelf</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="px-3 py-1.5 text-[11px] text-[#8C8275] uppercase tracking-wider font-semibold">
                        System Status
                      </div>
                      <div className="px-3 py-1.5 text-xs text-[#524B42] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Mock Backend Active</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-[#9B1C1C] hover:bg-[#FDF2F2] rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out / Switch User</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#2D2A26] bg-[#FAF8F5] hover:bg-[#EFE8DC] border border-[#E5DFC9] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
