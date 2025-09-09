"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/Card";
import * as configService from "@/services/configService";
import { GameConfig, UpdateConfigPayload } from "@/types/config";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const initialConfigState: UpdateConfigPayload = {
  min_range_setting: 1,
  max_range_setting: 100,
  custom_message_higher: '',
  custom_message_lower: '',
  custom_message_equal: '',
  hint_trigger_count: 5,
};

/**
 * @component ConfigPanel
 * @description An administrative panel for configuring the game's settings.
 */
export const ConfigPanel = () => {
  // #region States
  const [config, setConfig] = useState<UpdateConfigPayload>(initialConfigState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // #endregion

  // #region Effects
  useEffect(() => {
    const fetchConfig = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await configService.getConfig();
        setConfig(data);
      } catch (err: any) {
        if (err.response?.status === 403 || err.response?.status === 401) {
          setError("Acesso negado. Você precisa ser um administrador para ver esta página.");
        } else {
          setError("Falha ao carregar a configuração. Tente novamente mais tarde.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);
  // #endregion

  // #region Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prev) => ({ ...prev, [name]: value }));
  };

  const validateConfig = (): boolean => {
    const min = Number(config.min_range_setting);
    const max = Number(config.max_range_setting);
    const hintTrigger = Number(config.hint_trigger_count);

    if (config.min_range_setting === undefined || isNaN(min) || !Number.isInteger(min)) {
      setError("Valor inválido: O valor mínimo deve ser um número inteiro.");
      return false;
    }
    if (config.max_range_setting === undefined || isNaN(max) || !Number.isInteger(max)) {
      setError("Valor inválido: O valor máximo deve ser um número inteiro.");
      return false;
    }
    if (min >= max) {
      setError("Intervalo inválido: O valor mínimo deve ser menor que o valor máximo.");
      return false;
    }
    if (config.hint_trigger_count === undefined || isNaN(hintTrigger) || !Number.isInteger(hintTrigger) || hintTrigger <= 0) {
      setError("Gatilho de dica inválido: Deve ser um número inteiro maior que zero.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateConfig()) {
      return;
    }

    setIsSaving(true);
    try {
      const payload: UpdateConfigPayload = {
        min_range_setting: Number(config.min_range_setting),
        max_range_setting: Number(config.max_range_setting),
        custom_message_higher: config.custom_message_higher,
        custom_message_lower: config.custom_message_lower,
        custom_message_equal: config.custom_message_equal,
        hint_trigger_count: Number(config.hint_trigger_count),
      };
      await configService.updateConfig(payload);
      setSuccessMessage("Configuração salva com sucesso!");
    } catch (err: any) {
       if (err.response?.status === 403 || err.response?.status === 401) {
          setError("Acesso negado. Você precisa ser um administrador para salvar as configurações.");
        } else {
          setError("Falha ao salvar a configuração. Tente novamente.");
        }
    } finally {
      setIsSaving(false);
    }
  };
  // #endregion

  // #region Renderers
  const renderLoading = () => (
    <div className="flex items-center justify-center space-x-2 py-10">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span>Carregando configuração...</span>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="font-semibold text-lg mb-2">Intervalo de Números</legend>
        <div className="space-y-2">
          <label htmlFor="min_range_setting" className="text-sm font-medium leading-none">Valor Mínimo</label>
          <Input id="min_range_setting" name="min_range_setting" type="number" value={config.min_range_setting ?? ''} onChange={handleInputChange} placeholder="Ex: 1" disabled={isSaving} />
        </div>
        <div className="space-y-2">
          <label htmlFor="max_range_setting" className="text-sm font-medium leading-none">Valor Máximo</label>
          <Input id="max_range_setting" name="max_range_setting" type="number" value={config.max_range_setting ?? ''} onChange={handleInputChange} placeholder="Ex: 100" disabled={isSaving} />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-semibold text-lg mb-2">Mensagens de Feedback</legend>
        <div className="space-y-2">
          <label htmlFor="custom_message_higher" className="text-sm font-medium leading-none">Palpite &apos;Maior&apos;</label>
          <Input id="custom_message_higher" name="custom_message_higher" type="text" value={config.custom_message_higher ?? ''} onChange={handleInputChange} placeholder="Padrão: Muito alto!" disabled={isSaving} />
        </div>
        <div className="space-y-2">
          <label htmlFor="custom_message_lower" className="text-sm font-medium leading-none">Palpite &apos;Menor&apos;</label>
          <Input id="custom_message_lower" name="custom_message_lower" type="text" value={config.custom_message_lower ?? ''} onChange={handleInputChange} placeholder="Padrão: Muito baixo!" disabled={isSaving} />
        </div>
        <div className="space-y-2">
          <label htmlFor="custom_message_equal" className="text-sm font-medium leading-none">Palpite &apos;Correto&apos;</label>
          <Input id="custom_message_equal" name="custom_message_equal" type="text" value={config.custom_message_equal ?? ''} onChange={handleInputChange} placeholder="Padrão: Parabéns, você acertou!" disabled={isSaving} />
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="font-semibold text-lg mb-2">Dicas</legend>
        <div className="space-y-2">
          <label htmlFor="hint_trigger_count" className="text-sm font-medium leading-none">Acionar dica após (tentativas)</label>
          <Input id="hint_trigger_count" name="hint_trigger_count" type="number" value={config.hint_trigger_count ?? ''} onChange={handleInputChange} placeholder="Ex: 5" disabled={isSaving} />
        </div>
      </fieldset>

      <CardFooter className="p-0 pt-4">
        <Button type="submit" className="w-full" disabled={isSaving || isLoading}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSaving ? "Salvando..." : "Salvar Configuração"}
        </Button>
      </CardFooter>
    </form>
  );
  // #endregion

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Configuração do Jogo</CardTitle>
        <CardDescription>Ajuste o intervalo, mensagens e dicas para o jogo.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? renderLoading() : renderForm()}
        {error && (
          <div className="mt-4 flex items-center space-x-2 rounded-md border border-red-500/50 bg-red-500/10 p-3 text-red-300">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="mt-4 flex items-center space-x-2 rounded-md border border-green-500/50 bg-green-500/10 p-3 text-green-300">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{successMessage}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
