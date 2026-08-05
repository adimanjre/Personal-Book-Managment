import React from "react";
import {
  BookOpen,
  Bookmark,
  BookCheck,
  Clock,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";
import { DashboardStats as StatsType } from "@/lib/mockData";

interface DashboardStatsProps {
  stats: StatsType;
  selectedStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  selectedStatusFilter,
  onSelectStatusFilter,
}) => {
  const statCards = [
    {
      id: "ALL",
      label: "Total Library",
      value: stats.totalBooks,
      icon: BookOpen,
      accent: "text-[#2D2A26]",
      bg: "bg-[#FAF8F5]",
      border: "border-[#EBE5DA]",
      subtext: `${stats.totalPagesRead.toLocaleString()} total pages read`,
    },
    {
      id: "WANT_TO_READ",
      label: "Want to Read",
      value: stats.wantToRead,
      icon: Bookmark,
      accent: "text-[#9C6B30]", // muted amber
      bg: "bg-[#FAF6EE]",
      border: "border-[#EADCC8]",
      subtext: "Queued on shelf",
    },
    {
      id: "READING",
      label: "Currently Reading",
      value: stats.currentlyReading,
      icon: Clock,
      accent: "text-[#2C5E8A]", // muted slate/navy
      bg: "bg-[#F2F7FA]",
      border: "border-[#D4E3EF]",
      subtext: "In active progress",
    },
    {
      id: "COMPLETED",
      label: "Completed",
      value: stats.completed,
      icon: BookCheck,
      accent: "text-[#2D6A4F]", // muted forest green
      bg: "bg-[#F0F7F3]",
      border: "border-[#CCE5D8]",
      subtext: `${stats.completionRatePercentage}% of collection read`,
    },
  ];

  return (
    <section className="mb-8">
      {/* Editorial Header Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 gap-3">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#8C8275]">
            Library Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif text-[#2D2A26] font-normal tracking-tight mt-0.5">
            Reading Space
          </h1>
        </div>

        {/* Goal & Rating Pill */}
        <div className="flex items-center gap-3 text-xs">
          {stats.avgRating > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DA] text-[#423C35] font-medium shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
              <span>
                Avg. Rating: <strong>{stats.avgRating}</strong> / 5
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5DA] text-[#423C35] font-medium shadow-2xs">
            <Award className="w-3.5 h-3.5 text-[#2D2A26]" />
            <span>
              Finished: <strong>{stats.completed}</strong> books
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isSelected = selectedStatusFilter === card.id;

          return (
            <button
              key={card.id}
              onClick={() => onSelectStatusFilter(card.id)}
              className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                card.bg
              } ${card.border} ${
                isSelected
                  ? "ring-2 ring-[#2D2A26] shadow-sm transform -translate-y-0.5"
                  : "hover:border-[#C8C0B0] hover:shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#665E55]">
                  {card.label}
                </span>
                <div className={`p-1.5 rounded-lg bg-white/70 ${card.accent}`}>
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#2D2A26] tracking-tight">
                  {card.value}
                </span>
                <span className="text-[11px] text-[#8C8275] truncate hidden sm:inline">
                  {card.subtext}
                </span>
              </div>

              {/* Progress bar line for Completed card */}
              {card.id === "COMPLETED" && stats.totalBooks > 0 && (
                <div className="w-full bg-[#D8EADB] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#2D6A4F] h-full rounded-full transition-all duration-500"
                    style={{ width: `${stats.completionRatePercentage}%` }}
                  />
                </div>
              )}

              {/* Progress bar line for Reading card */}
              {card.id === "READING" && stats.totalBooks > 0 && (
                <div className="w-full bg-[#DCE8F2] h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-[#2C5E8A] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((stats.currentlyReading / stats.totalBooks) * 100)}%`,
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
