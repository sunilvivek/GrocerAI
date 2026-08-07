import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CartProvider } from "@/features/cart/cart-context";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
      <div className="flex min-h-dvh flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  );
}