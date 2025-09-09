export type GameConfig = {
  min_range_setting: number;
  max_range_setting: number;
  custom_message_higher: string;
  custom_message_lower: string;
  custom_message_equal: string;
  hint_trigger_count: number;
};

export type UpdateConfigPayload = Partial<GameConfig>;
