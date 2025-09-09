import { Request, Response, NextFunction } from 'express';
import { configService } from '@/services/config/config.service';
import { ApiResponse } from '@/utils/apiResponse';
import { httpStatus } from '@/constants/httpStatus';
import { GameConfig } from '@/types/config.types';

export class ConfigController {
  public async getConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const config = await configService.getConfig();
      new ApiResponse(res).send(httpStatus.OK, config, 'Configuração do jogo recuperada com sucesso.');
    } catch (error) {
      next(error);
    }
  }

  public async updateConfig(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // FC-005: Extrai todos os campos do body para permitir atualização parcial
      const {
        min_range_setting,
        max_range_setting,
        custom_message_higher,
        custom_message_lower,
        custom_message_equal,
        hint_trigger_count
      } = req.body;

      const payload: Partial<GameConfig> = {
        minRange: min_range_setting,
        maxRange: max_range_setting,
        customMessageHigher: custom_message_higher,
        customMessageLower: custom_message_lower,
        customMessageEqual: custom_message_equal,
        hintTriggerCount: hint_trigger_count,
      };

      // Remove chaves indefinidas para não sobrescrever com null/undefined
      Object.keys(payload).forEach(key => payload[key as keyof typeof payload] === undefined && delete payload[key as keyof typeof payload]);

      const updatedConfig = await configService.updateConfig(payload);
      new ApiResponse(res).send(httpStatus.OK, updatedConfig, 'Configuração do jogo atualizada com sucesso.');
    } catch (error) {
      next(error);
    }
  }
}
