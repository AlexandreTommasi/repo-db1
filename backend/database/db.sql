-- Banco de dados para o jogo GuessNumber
-- SQL Server Database Script
-- Criado em: 2025-09-09

-- Criar banco de dados (descomente se necessário)
-- CREATE DATABASE guess_number_db;
-- GO
-- USE guess_number_db;
-- GO

-- =====================================================
-- Tabela: game_sessions
-- Armazena as sessões de jogo
-- =====================================================
CREATE TABLE game_sessions (
    game_id NVARCHAR(36) PRIMARY KEY,
    secret_number INT NOT NULL,
    attempts INT DEFAULT 0,
    start_time DATETIME2 DEFAULT GETDATE(),
    end_time DATETIME2 NULL,
    game_state NVARCHAR(20) DEFAULT 'in_progress' CHECK (game_state IN ('in_progress', 'finished')),
    total_time_elapsed INT NULL, -- Tempo total em segundos
    min_range INT NOT NULL,
    max_range INT NOT NULL,
    consecutive_incorrect_attempts INT DEFAULT 0,
    hints_used INT DEFAULT 0,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Índices para game_sessions
CREATE INDEX idx_game_state ON game_sessions(game_state);
CREATE INDEX idx_start_time ON game_sessions(start_time);
CREATE INDEX idx_created_at ON game_sessions(created_at);
GO

-- =====================================================
-- Tabela: game_attempts
-- Armazena o histórico de tentativas de cada jogo
-- =====================================================
CREATE TABLE game_attempts (
    attempt_id INT IDENTITY(1,1) PRIMARY KEY,
    game_id NVARCHAR(36) NOT NULL,
    guess_number INT NOT NULL,
    feedback NVARCHAR(10) NOT NULL CHECK (feedback IN ('LOWER', 'HIGHER', 'EQUAL')),
    attempt_order INT NOT NULL,
    attempt_time DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_game_attempts_game_sessions 
        FOREIGN KEY (game_id) REFERENCES game_sessions(game_id) ON DELETE CASCADE
);
GO

-- Índices para game_attempts
CREATE INDEX idx_game_attempts_game_id ON game_attempts(game_id);
CREATE INDEX idx_attempt_order ON game_attempts(game_id, attempt_order);
GO

-- =====================================================
-- Tabela: match_history
-- Armazena o histórico de partidas finalizadas
-- =====================================================
CREATE TABLE match_history (
    history_id NVARCHAR(36) PRIMARY KEY,
    game_id NVARCHAR(36) NOT NULL,
    -- user_id NVARCHAR(36) NULL, -- Para futura implementação de autenticação
    attempts INT NOT NULL,
    total_time_elapsed INT NOT NULL, -- Tempo total em segundos
    difficulty_rating INT NULL CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    saved_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_match_history_game_sessions 
        FOREIGN KEY (game_id) REFERENCES game_sessions(game_id) ON DELETE CASCADE
);
GO

-- Índices para match_history
CREATE INDEX idx_match_history_saved_at ON match_history(saved_at);
CREATE INDEX idx_match_history_game_id ON match_history(game_id);
CREATE INDEX idx_match_history_difficulty ON match_history(difficulty_rating);
-- CREATE INDEX idx_match_history_user_id ON match_history(user_id); -- Para futura implementação
GO

-- =====================================================
-- Tabela: game_configurations
-- Armazena as configurações do jogo
-- =====================================================
CREATE TABLE game_configurations (
    config_id INT IDENTITY(1,1) PRIMARY KEY,
    min_range INT NOT NULL DEFAULT 1,
    max_range INT NOT NULL DEFAULT 100,
    custom_message_higher NVARCHAR(255) NULL,
    custom_message_lower NVARCHAR(255) NULL,
    custom_message_equal NVARCHAR(255) NULL,
    hint_trigger_count INT NULL, -- Número de tentativas incorretas para ativar dica
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);
GO

-- Índice para game_configurations
CREATE INDEX idx_game_config_is_active ON game_configurations(is_active);
GO

-- =====================================================
-- Tabela: game_hints
-- Armazena dicas usadas durante o jogo
-- =====================================================
CREATE TABLE game_hints (
    hint_id INT IDENTITY(1,1) PRIMARY KEY,
    game_id NVARCHAR(36) NOT NULL,
    hint_text NVARCHAR(MAX) NOT NULL,
    hint_type NVARCHAR(50) NULL, -- Tipo de dica: range, parity, etc
    used_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_game_hints_game_sessions 
        FOREIGN KEY (game_id) REFERENCES game_sessions(game_id) ON DELETE CASCADE
);
GO

-- Índice para game_hints
CREATE INDEX idx_game_hints_game_id ON game_hints(game_id);
GO

-- =====================================================
-- Trigger para atualizar updated_at em game_sessions
-- =====================================================
CREATE TRIGGER trg_game_sessions_updated_at
ON game_sessions
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE game_sessions
    SET updated_at = GETDATE()
    FROM game_sessions gs
    INNER JOIN inserted i ON gs.game_id = i.game_id;
END;
GO

-- =====================================================
-- Trigger para atualizar updated_at em game_configurations
-- =====================================================
CREATE TRIGGER trg_game_configurations_updated_at
ON game_configurations
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE game_configurations
    SET updated_at = GETDATE()
    FROM game_configurations gc
    INNER JOIN inserted i ON gc.config_id = i.config_id;
END;
GO

-- =====================================================
-- Inserir configuração padrão
-- =====================================================
INSERT INTO game_configurations (
    min_range, 
    max_range, 
    custom_message_higher,
    custom_message_lower,
    custom_message_equal,
    hint_trigger_count
) VALUES (
    1, 
    100, 
    N'Tente um número menor!',
    N'Tente um número maior!',
    N'Parabéns! Você acertou!',
    3
);
GO

-- =====================================================
-- Views úteis
-- =====================================================

-- View para estatísticas gerais dos jogos
CREATE VIEW game_statistics AS
SELECT 
    COUNT(*) as total_games,
    AVG(CAST(attempts AS FLOAT)) as avg_attempts,
    AVG(CAST(total_time_elapsed AS FLOAT)) as avg_time_seconds,
    MIN(attempts) as min_attempts,
    MAX(attempts) as max_attempts,
    SUM(CASE WHEN game_state = 'finished' THEN 1 ELSE 0 END) as completed_games,
    SUM(CASE WHEN game_state = 'in_progress' THEN 1 ELSE 0 END) as ongoing_games
FROM game_sessions;
GO

-- View para ranking de melhores jogadores (baseado em tentativas)
CREATE VIEW best_scores AS
SELECT TOP 10
    gs.game_id,
    gs.attempts,
    gs.total_time_elapsed,
    gs.end_time,
    mh.difficulty_rating
FROM game_sessions gs
LEFT JOIN match_history mh ON gs.game_id = mh.game_id
WHERE gs.game_state = 'finished'
ORDER BY gs.attempts ASC, gs.total_time_elapsed ASC;
GO

-- =====================================================
-- Stored Procedures
-- =====================================================

-- Procedure para limpar jogos antigos não finalizados
CREATE PROCEDURE sp_cleanup_old_games
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM game_sessions 
    WHERE game_state = 'in_progress' 
    AND start_time < DATEADD(HOUR, -24, GETDATE());
    
    RETURN @@ROWCOUNT;
END;
GO

-- Procedure para obter estatísticas de um jogo específico
CREATE PROCEDURE sp_get_game_stats
    @game_id NVARCHAR(36)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        gs.*,
        COUNT(ga.attempt_id) as total_attempts,
        MAX(ga.attempt_order) as last_attempt_order
    FROM game_sessions gs
    LEFT JOIN game_attempts ga ON gs.game_id = ga.game_id
    WHERE gs.game_id = @game_id
    GROUP BY gs.game_id, gs.secret_number, gs.attempts, gs.start_time, 
             gs.end_time, gs.game_state, gs.total_time_elapsed, gs.min_range,
             gs.max_range, gs.consecutive_incorrect_attempts, gs.hints_used,
             gs.created_at, gs.updated_at;
END;
GO

-- Procedure para criar novo jogo
CREATE PROCEDURE sp_create_new_game
    @game_id NVARCHAR(36),
    @secret_number INT,
    @min_range INT,
    @max_range INT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO game_sessions (
        game_id,
        secret_number,
        min_range,
        max_range,
        attempts,
        game_state,
        consecutive_incorrect_attempts,
        hints_used
    ) VALUES (
        @game_id,
        @secret_number,
        @min_range,
        @max_range,
        0,
        'in_progress',
        0,
        0
    );
    
    SELECT * FROM game_sessions WHERE game_id = @game_id;
END;
GO

-- Procedure para registrar uma tentativa
CREATE PROCEDURE sp_register_attempt
    @game_id NVARCHAR(36),
    @guess_number INT,
    @feedback NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @attempt_order INT;
    
    -- Obter o próximo número de ordem da tentativa
    SELECT @attempt_order = ISNULL(MAX(attempt_order), 0) + 1
    FROM game_attempts
    WHERE game_id = @game_id;
    
    -- Inserir a tentativa
    INSERT INTO game_attempts (
        game_id,
        guess_number,
        feedback,
        attempt_order
    ) VALUES (
        @game_id,
        @guess_number,
        @feedback,
        @attempt_order
    );
    
    -- Atualizar contador de tentativas na sessão
    UPDATE game_sessions
    SET attempts = attempts + 1,
        consecutive_incorrect_attempts = CASE 
            WHEN @feedback != 'EQUAL' THEN consecutive_incorrect_attempts + 1
            ELSE 0
        END,
        game_state = CASE 
            WHEN @feedback = 'EQUAL' THEN 'finished'
            ELSE game_state
        END,
        end_time = CASE 
            WHEN @feedback = 'EQUAL' THEN GETDATE()
            ELSE end_time
        END,
        total_time_elapsed = CASE 
            WHEN @feedback = 'EQUAL' THEN DATEDIFF(SECOND, start_time, GETDATE())
            ELSE total_time_elapsed
        END
    WHERE game_id = @game_id;
    
    RETURN @attempt_order;
END;
GO

-- =====================================================
-- Funções úteis (User-Defined Functions)
-- =====================================================

-- Função para calcular o tempo de jogo formatado
CREATE FUNCTION fn_format_game_time
(
    @seconds INT
)
RETURNS NVARCHAR(50)
AS
BEGIN
    DECLARE @result NVARCHAR(50);
    
    IF @seconds IS NULL
        RETURN NULL;
    
    SET @result = 
        CAST(@seconds / 3600 AS NVARCHAR(10)) + 'h ' +
        CAST((@seconds % 3600) / 60 AS NVARCHAR(10)) + 'm ' +
        CAST(@seconds % 60 AS NVARCHAR(10)) + 's';
    
    RETURN @result;
END;
GO

-- =====================================================
-- Comentários de documentação
-- =====================================================
EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Tabela principal para armazenar as sessões de jogo GuessNumber',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'game_sessions';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Histórico detalhado de cada tentativa realizada em um jogo',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'game_attempts';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Histórico de partidas finalizadas para análise e estatísticas',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'match_history';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Configurações globais do jogo incluindo ranges e mensagens customizadas',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'game_configurations';

EXEC sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'Registro de dicas utilizadas durante os jogos',
    @level0type = N'SCHEMA', @level0name = 'dbo',
    @level1type = N'TABLE',  @level1name = 'game_hints';
GO