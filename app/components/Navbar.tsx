"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CategoryViewModel } from "@/viewmodels/CategoryModel";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "./CartContext";
import { UserViewModel } from "@/viewmodels/UserViewModel";

export default function Navbar() {
  const [vm] = useState(() => new CategoryViewModel());
  const [userVm] = useState(() => new UserViewModel());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountOpen, setAccountOpen] = useState(false);
  const [auth, setAuth] = useState<
    | {
        access_token: string;
        refresh_token: string;
        user: { id: string; email: string; phone: string };
      }
    | null
  >(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalQuantity } = useCart();

  const activeCategory = searchParams?.get("category") || "";

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        setLoading(true);
        await vm.getCategory();
        if (mounted) setError(vm.error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [vm]);

  // Load auth from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("auth") : null;
      if (raw) setAuth(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const categories = useMemo(() => vm.category ?? [], [vm.category]);

  const onSelectCategory = (id: string | null) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (id) params.set("category", id);
    else params.delete("category");
    router.push(`${pathname}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <button
          className="md:hidden rounded border px-3 py-2"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>
        <Link href="/" className="text-xl font-semibold">
          Demo Ecom
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          <button
            className={`rounded px-3 py-2 text-sm ${
              activeCategory === "" ? "bg-black text-white" : "hover:bg-neutral-100"
            }`}
            onClick={() => onSelectCategory(null)}
          >
            Tất cả
          </button>
          {loading && <span className="px-2 text-sm text-neutral-500">Đang tải...</span>}
          {error && <span className="px-2 text-sm text-red-600">{String(error)}</span>}
          {categories.map((c) => (
            <button
              key={c.getId()}
              className={`rounded px-3 py-2 text-sm ${
                activeCategory === c.getId()
                  ? "bg-black text-white"
                  : "hover:bg-neutral-100"
              }`}
              onClick={() => onSelectCategory(c.getId())}
            >
              {c.getName()}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4">
          {!auth ? (
            <button
              className="rounded border px-3 py-1.5 text-sm hover:bg-neutral-100"
              onClick={() => setLoginOpen(true)}
            >
              Đăng nhập
            </button>
          ) : (
            <div className="relative">
              <button
                className="flex items-center gap-2 rounded border px-3 py-1.5 text-sm hover:bg-neutral-100"
                onClick={() => setAccountOpen((v) => !v)}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-neutral-200 text-xs font-semibold">
                  {auth.user.email.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[160px] truncate">{auth.user.email}</span>
                <span>▾</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white p-3 shadow-lg">
                  <div className="mb-2 border-b pb-2">
                    <div className="text-sm font-medium">{auth.user.email}</div>
                    <div className="text-xs text-neutral-500">{auth.user.phone}</div>
                  </div>
                  <div className="grid gap-2">
                    <button
                      className="w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100"
                      onClick={() => {
                        alert(`Email: ${auth.user.email}\nPhone: ${auth.user.phone}`);
                        setAccountOpen(false);
                      }}
                    >
                      Xem thông tin
                    </button>
                    <button
                      className="w-full rounded px-3 py-2 text-left text-sm hover:bg-neutral-100 text-red-600"
                      onClick={() => {
                        try {
                          localStorage.removeItem("auth");
                        } catch {}
                        setAuth(null);
                        userVm.loginModel = null;
                        userVm.user = null;
                        setAccountOpen(false);
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          <Link href="/cart" className="relative inline-flex items-center gap-2">
            <span className="text-lg">🛒</span>
            <span className="text-sm">Giỏ hàng</span>
            {totalQuantity > 0 && (
              <span className="absolute -right-2 -top-2 rounded-full bg-black px-2 py-0.5 text-xs text-white">
                {totalQuantity}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-2 flex flex-wrap gap-2">
            <button
              className={`rounded px-3 py-2 text-sm ${
                activeCategory === "" ? "bg-black text-white" : "hover:bg-neutral-100"
              }`}
              onClick={() => onSelectCategory(null)}
            >
              Tất cả
            </button>
            {categories.map((c) => (
              <button
                key={c.getId()}
                className={`rounded px-3 py-2 text-sm ${
                  activeCategory === c.getId()
                    ? "bg-black text-white"
                    : "hover:bg-neutral-100"
                }`}
                onClick={() => onSelectCategory(c.getId())}
              >
                {c.getName()}
              </button>
            ))}
          </div>
        </div>
      )}

      {loginOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-4 shadow-lg">
            <div className="mb-3 text-lg font-semibold">Đăng nhập</div>
            <form
              className="grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                await userVm.login(email, password);
                if (!userVm.error && userVm.loginModel && userVm.user) {
                  const stored = {
                    access_token: userVm.loginModel.getAccessToken(),
                    refresh_token: userVm.loginModel.getRefreshToken(),
                    user: {
                      id: userVm.user.getId(),
                      email: userVm.user.getEmail(),
                      phone: userVm.user.getPhone(),
                    },
                  };
                  try {
                    localStorage.setItem("auth", JSON.stringify(stored));
                  } catch {}
                  setAuth(stored);
                  setLoginOpen(false);
                }
              }}
            >
              <div className="grid gap-1">
                <label className="text-sm text-neutral-600">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  placeholder="you@example.com"
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm text-neutral-600">Mật khẩu</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-black"
                  placeholder="••••••••"
                />
              </div>

              {userVm.error && (
                <div className="text-sm text-red-600">{String(userVm.error)}</div>
              )}

              <div className="mt-1 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded px-3 py-2 text-sm hover:bg-neutral-100"
                  onClick={() => setLoginOpen(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded bg-black px-4 py-2 text-sm text-white disabled:opacity-60"
                  disabled={userVm.loading}
                >
                  {userVm.loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}


