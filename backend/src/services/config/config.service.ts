import fs from 'fs/promises';
import path from 'path';
import { GameConfig } from '@/types/config.types';
import { logger } from '@/utils/logger';

const CONFIG_FILE_PATH = path.resolve(process.cwd(), 'game-config.json');
// FC-005: Adicionando valores padrão para as novas configurações
const DEFAULT_CONFIG: GameConfig = { 
  minRange: 1, 
  maxRange: 100,
  customMessageHigher: 'Muito alto!',
  customMessageLower: 'Muito baixo!',
  customMessageEqual: 'Parabéns, você acertou!',
  hintTriggerCount: 5,
};

class ConfigService {
  private configCache: GameConfig | null = null;

  constructor() {
    this.loadConfig().catch(err => logger.error('Falha ao carregar a configuração inicial do jogo.', err));
  }

  private async loadConfig(): Promise<void> {
    try {
      const fileContent = await fs.readFile(CONFIG_FILE_PATH, 'utf-8');
      // Garante que a configuração carregada tenha todos os campos padrão
      this.configCache = { ...DEFAULT_CONFIG, ...JSON.parse(fileContent) };
      logger.info('Configuração do jogo carregada do arquivo.');
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        logger.warn('Arquivo de configuração não encontrado. Usando e criando configuração padrão.');
        this.configCache = { ...DEFAULT_CONFIG };
        await this.persistConfig(this.configCache);
      } else {
        logger.error('Erro ao ler o arquivo de configuração. Usando configuração padrão.', error);
        this.configCache = { ...DEFAULT_CONFIG };
      }
    }
  }

  private async persistConfig(config: GameConfig): Promise<void> {
    try {
      await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(config, null, 2));
      logger.info('Configuração do jogo salva no arquivo.');
    } catch (error) {
      logger.error('Erro ao salvar o arquivo de configuração.', error);
      throw new Error('Não foi possível salvar a configuração.');
    }
  }

  public async getConfig(): Promise<GameConfig> {
    if (!this.configCache) {
      await this.loadConfig();
    }
    return this.configCache!;
  }

  // FC-005: Atualiza o método para aceitar um payload parcial de configuração
  public async updateConfig(payload: Partial<GameConfig>): Promise<GameConfig> {
    const currentConfig = await this.getConfig();
    
    // Mescla a configuração atual com o novo payload
    const newConfig: GameConfig = {
      ...currentConfig,
      ...payload,
    };

    await this.persistConfig(newConfig);
    
    this.configCache = newConfig;
    logger.info('Cache de configuração do jogo invalidado e atualizado.');

    return newConfig;
  }
}

// Exporta uma instância singleton do serviço
export const configService = new ConfigService();
