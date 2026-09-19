"use client";

import { Suspense, useState } from "react";
import Header from "./Header";
import FilterBar from "./FilterBar";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import AgeGate from "./AgeGate";
import CategoryChips from "./CategoryChips";

export default function AppShell({
  children,
  activeCategory = "all",
}: {
  children: React.ReactNode;
  activeCategory?: string;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  return (
    <>
      <AgeGate />
      <Suspense>
        <Header onOpenFilters={() => setFiltersOpen(true)} />
      </Suspense>
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-4">
        <Suspense>
          <CategoryChips active={activeCategory} />
        </Suspense>
        <main className="py-4">{children}</main>
      </div>
      <Footer />
      <BottomNav />
      <Suspense>
        <FilterBar open={filtersOpen} onClose={() => setFiltersOpen(false)} />
      </Suspense>
    </>
  );
}
