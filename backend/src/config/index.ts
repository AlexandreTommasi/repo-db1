import { serverConfig } from './server.config';

// A configuração do jogo foi movida para o ConfigService.
// O objeto config agora contém apenas configurações do servidor.
export const config = {
  ...serverConfig,
};
