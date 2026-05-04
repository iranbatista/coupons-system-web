import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { couponService } from "@/services/coupon.service";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ruleSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("MINIMUM_VALUE"),
    minValue: z
      .string()
      .transform((val) => parseFloat(val))
      .pipe(z.number().positive("Valor deve ser positivo")),
  }),
  z.object({
    type: z.literal("EXPIRATION"),
    expDate: z.string().min(1, "Data obrigatória"),
  }),
  z.object({
    type: z.literal("SINGLE_USE"),
  }),
]);

const formSchema = z.object({
  code: z.string().min(1, "Código obrigatório"),
  discountType: z.enum(["FIXED", "PERCENTAGE"]),
  discountValue: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(z.number().positive("Valor deve ser positivo")),
  rules: z.array(ruleSchema).min(1, "Adicione pelo menos uma regra"),
});

type FormInput = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

interface CreateCouponModalProps {
  onCreated?: () => void;
}

export function CreateCouponModal({ onCreated }: CreateCouponModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      discountType: "PERCENTAGE",
      discountValue: "",
      rules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  async function onSubmit(values: FormOutput) {
    setLoading(true);
    try {
      await couponService.create({
        code: values.code,
        discountType: values.discountType,
        discountValue: values.discountValue,
        rules: values.rules.map((rule) => {
          const { type, ...config } = rule;
          return { type, config };
        }),
      });
      toast.success("Cupom criado com sucesso!");
      form.reset();
      setOpen(false);
      onCreated?.();
    } catch (e: unknown) {
      const message = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      toast.error(message ?? "Erro ao criar cupom.");
    } finally {
      setLoading(false);
    }
  }

  function addRule(type: "MINIMUM_VALUE" | "EXPIRATION" | "SINGLE_USE") {
    if (type === "MINIMUM_VALUE") append({ type, minValue: "" });
    if (type === "EXPIRATION") append({ type, expDate: "" });
    if (type === "SINGLE_USE") append({ type });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Novo cupom
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Criar cupom</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <FieldGroup>
            {/* Código */}
            <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Código</FieldLabel>
                  <Input
                    {...field}
                    placeholder="EX: DESCONTO20"
                    onChange={(e) =>
                      field.onChange(e.target.value.toUpperCase())
                    }
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Tipo e valor */}
            <div className="flex gap-3">
              <Controller
                name="discountType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-1">
                    <FieldLabel>Tipo</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PERCENTAGE">Percentual</SelectItem>
                        <SelectItem value="FIXED">Fixo</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="discountValue"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="flex-1">
                    <FieldLabel>Valor</FieldLabel>
                    <Input type="number" placeholder="20" {...field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Regras */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Regras</FieldLabel>
                <Select
                  onValueChange={(v) =>
                    addRule(v as "MINIMUM_VALUE" | "EXPIRATION" | "SINGLE_USE")
                  }
                >
                  <SelectTrigger className="w-auto h-7 text-xs border-dashed">
                    <Plus className="w-3 h-3 mr-1" />
                    <SelectValue placeholder="Adicionar regra" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MINIMUM_VALUE">Valor mínimo</SelectItem>
                    <SelectItem value="EXPIRATION">Expiração</SelectItem>
                    <SelectItem value="SINGLE_USE">Uso único</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.formState.errors.rules?.root && (
                <FieldError errors={[form.formState.errors.rules.root]} />
              )}

              {fields.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-3 border border-dashed border-neutral-200 rounded-lg">
                  Nenhuma regra adicionada
                </p>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2"
                    >
                      <div className="flex-1">
                        {field.type === "MINIMUM_VALUE" && (
                          <Controller
                            control={form.control}
                            name={`rules.${index}.minValue`}
                            render={({ field: f, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs">
                                  Valor mínimo (R$)
                                </FieldLabel>
                                <Input
                                  type="number"
                                  placeholder="100"
                                  className="h-7 text-xs"
                                  {...f}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        )}
                        {field.type === "EXPIRATION" && (
                          <Controller
                            control={form.control}
                            name={`rules.${index}.expDate`}
                            render={({ field: f, fieldState }) => (
                              <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-xs">
                                  Data de expiração
                                </FieldLabel>
                                <Input
                                  type="date"
                                  className="h-7 text-xs"
                                  {...f}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        )}
                        {field.type === "SINGLE_USE" && (
                          <p className="text-xs text-neutral-500 py-1">
                            Uso único por usuário
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-neutral-300 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Criando..." : "Criar cupom"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
