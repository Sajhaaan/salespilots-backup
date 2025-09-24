"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingBag, CreditCard, Zap, Settings } from "lucide-react"

const tabs = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingBag },
  { href: "/dashboard/payments", label: "Pay", icon: CreditCard },
  { href: "/dashboard/automation", label: "AI", icon: Zap },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function MobileTabBar(): JSX.Element {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/10">
      {/* Safe area padding for devices with home indicators */}
      <div className="px-4 py-2 pb-safe">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((t) => {
            const active = pathname === t.href || pathname?.startsWith(t.href + "/")
            const Icon = t.icon
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex flex-col items-center justify-center p-3 rounded-xl min-w-[60px] transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30"
                    : "text-white/60 hover:text-white hover:bg-white/10"
                }`}
                aria-label={t.label}
              >
                <div className="relative">
                  <Icon className={`h-6 w-6 transition-all duration-200 ${active ? "scale-110" : ""}`} />
                  {active && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-all duration-200 ${
                  active ? "text-white" : "text-white/60"
                }`}>
                  {t.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}


