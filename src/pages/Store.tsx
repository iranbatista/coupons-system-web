import { products } from "@/data/products";
import { useCart } from "@/features/cart/useCart";
import { useCoupon } from "@/features/coupon/useCoupon";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CouponsModal } from "@/components/CouponsModal";
import { ShoppingCart, Trash2, LogOut, Tag } from "lucide-react";
import { toast } from "sonner";
import { CreateCouponModal } from "@/components/CreateCouponModal";

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function Store() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { items, addItem, removeItem, updateQuantity, total, clearCart } =
    useCart();
  const { code, setCode, result, error, loading, applyCoupon, clearCoupon } =
    useCoupon();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  function handleCheckout() {
    toast.success("Compra realizada com sucesso!", {
      description: `Total: ${formatPrice(finalTotal)}`,
    });
    clearCart();
    clearCoupon();
  }

  const finalTotal = result ? result.finalTotal : total;

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-neutral-900 tracking-widest">
            COUPONS SYSTEM
          </h1>
          <div className="flex items-center gap-2">
            <CreateCouponModal />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 flex gap-6 items-start">
        {/* Produtos */}
        <main className="flex-1">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-widest mb-4">
            Produtos
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <p className="text-sm font-medium text-neutral-900 mb-1">
                    {product.name}
                  </p>
                  <p className="text-sm text-neutral-500 mb-3">
                    {formatPrice(product.price)}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => addItem(product)}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Sidebar */}
        <aside className="w-80 shrink-0 mt-9">
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShoppingCart className="w-4 h-4 text-neutral-500" />
              <h2 className="text-sm font-semibold text-neutral-900">
                Carrinho
              </h2>
              {items.length > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {items.length}
                </Badge>
              )}
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-neutral-400 py-4 text-center">
                Nenhum item adicionado
              </p>
            ) : (
              <div className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="w-5 h-5 rounded text-neutral-500 hover:text-neutral-900 text-xs border border-neutral-200 flex items-center justify-center"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>
                      <span className="text-xs w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        className="w-5 h-5 rounded text-neutral-500 hover:text-neutral-900 text-xs border border-neutral-200 flex items-center justify-center"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-300 hover:text-red-400 ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />

            {/* Cupom */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-3.5 h-3.5 text-neutral-500" />
                <p className="text-xs font-medium text-neutral-600">Cupom</p>
              </div>

              {result ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-green-700">
                      {result.code}
                    </span>
                    <button
                      onClick={clearCoupon}
                      className="text-xs text-green-600 hover:text-green-800"
                    >
                      Remover
                    </button>
                  </div>
                  <p className="text-xs text-green-600">
                    − {formatPrice(result.discount)}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código do cupom"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="text-xs h-8"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 shrink-0"
                      onClick={() => applyCoupon(total)}
                      disabled={loading || items.length === 0}
                    >
                      {loading ? "..." : "Aplicar"}
                    </Button>
                  </div>
                  <CouponsModal onSelect={(code) => setCode(code)} />
                </div>
              )}

              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>

            <Separator className="my-4" />

            {/* Total */}
            <div className="flex flex-col gap-2 mb-4">
              {result && (
                <>
                  <div className="flex justify-between text-xs text-neutral-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(result.originalTotal)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-green-600">
                    <span>Desconto</span>
                    <span>− {formatPrice(result.discount)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-sm font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={items.length === 0}
              onClick={handleCheckout}
            >
              Finalizar compra
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
