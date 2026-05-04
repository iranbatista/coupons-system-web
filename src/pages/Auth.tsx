import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/hooks/useAuth";

export function Auth() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(mode: "login" | "register") {
    setError("");
    setLoading(true);
    try {
      const fn = mode === "login" ? authService.login : authService.register;
      const { access_token } = await fn(email, password);
      login(access_token);
      navigate("/");
    } catch (e: unknown) {
      const message = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setError(message ?? "Algo deu errado, tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-neutral-900 mb-1">
            Coupons System
          </h1>
          <p className="text-sm text-neutral-500">
            Entre na sua conta ou crie uma nova para continuar.
          </p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="login" className="flex-1">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1">
              Criar conta
            </TabsTrigger>
          </TabsList>

          {(["login", "register"] as const).map((mode) => (
            <TabsContent key={mode} value={mode}>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button
                  size="lg"
                  className="w-full mt-1"
                  onClick={() => handleSubmit(mode)}
                  disabled={loading}
                >
                  {loading
                    ? "Aguarde..."
                    : mode === "login"
                      ? "Entrar"
                      : "Criar conta"}
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
