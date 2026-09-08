"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Language } from "@/lib/quizzes";

export function LanguageToggle({ language }: { language: Language }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchTo(next: Language) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", next);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="language-toggle" aria-label="Language / Idioma">
      <button className={language === "en" ? "active" : ""} onClick={() => switchTo("en")}>EN</button>
      <span>·</span>
      <button className={language === "es" ? "active" : ""} onClick={() => switchTo("es")}>ES</button>
    </div>
  );
}
