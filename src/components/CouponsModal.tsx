import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { couponService } from "@/services/coupon.service";
import type { Coupon } from "@/types";
import { useEffect, useState } from "react";
import { Ticket } from "lucide-react";

interface CouponsModalProps {
  onSelect: (code: string) => void;
}

function formatRule(type: string, config: string) {
  const parsed = JSON.parse(config);
  switch (type) {
    case "MINIMUM_VALUE":
      return `Mínimo ${(parsed.minValue as number).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}`;
    case "EXPIRATION":
      return `Válido até ${new Date(parsed.expDate).toLocaleDateString("pt-BR")}`;
    case "SINGLE_USE":
      return "Uso único";
    default:
      return type;
  }
}

export function CouponsModal({ onSelect }: CouponsModalProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    async function fetchCoupons() {
      setLoading(true);
      try {
        const data = await couponService.getAll();
        setCoupons(data);
      } finally {
        setLoading(false);
      }
    }

    fetchCoupons();
  }, [open]);

  function handleSelect(code: string) {
    onSelect(code);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-neutral-400 hover:text-neutral-600 underline underline-offset-2">
          Ver cupons disponíveis
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            Cupons disponíveis
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-neutral-400 py-4 text-center">
            Carregando...
          </p>
        ) : coupons.length === 0 ? (
          <p className="text-sm text-neutral-400 py-4 text-center">
            Nenhum cupom disponível
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 mt-2">
            {coupons.map((coupon) => (
              <button
                key={coupon.id}
                onClick={() => handleSelect(coupon.code)}
                className="group w-full text-left flex items-stretch border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 rounded-lg overflow-hidden transition-colors"
              >
                {/* Lado esquerdo — destaque do desconto */}
                <div className="flex items-center justify-center bg-neutral-100 group-hover:bg-neutral-200 transition-colors px-4 py-3 w-20 shrink-0">
                  <span className="text-sm font-bold text-neutral-900 leading-tight text-center">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}%`
                      : `R$${coupon.discountValue}`}
                  </span>
                </div>

                {/* Borda tracejada separadora */}
                <div className="border-l border-dashed border-neutral-200 group-hover:border-neutral-300 transition-colors" />

                {/* Lado direito — código e regras */}
                <div className="flex-1 px-4 py-3">
                  <p className="text-xs font-semibold text-neutral-900 mb-1.5 tracking-widest uppercase">
                    {coupon.code}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {coupon.rules.map((rule) => (
                      <span
                        key={rule.id}
                        className="text-xs text-neutral-400 bg-neutral-100 rounded px-1.5 py-0.5"
                      >
                        {formatRule(rule.type, rule.config)}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
