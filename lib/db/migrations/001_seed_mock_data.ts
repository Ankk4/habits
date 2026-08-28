import {
  encodeDaysOfWeek,
  encodeDailyTarget,
  encodeScheduledTimes,
  mockCompletionSeed,
  mockCueSeed,
  mockHabitSeed,
  mockRewardSeed,
  mockStackSeed,
  MOCK_SEED_TIMESTAMP,
} from "../seed/mockHabits";

export const SEED_MOCK_DATA_ID = "001_seed_mock_data";

export const SEED_MOCK_DATA_SQL = `
INSERT OR IGNORE INTO habit (
  id, name, description, type, cadence, days_of_week,
  completion_mode, daily_target, scheduled_times, created_at, updated_at
) VALUES
${mockHabitSeed
  .map((habit) => {
    const days = encodeDaysOfWeek(habit.daysOfWeek);
    const daysSql = days ? `'${days}'` : "NULL";
    const scheduled = encodeScheduledTimes(habit.scheduledTimes);
    const scheduledSql = scheduled ? `'${scheduled}'` : "NULL";
    const targetSql = encodeDailyTarget(habit.dailyTarget);
    return `  (${habit.id}, '${habit.name.replace(/'/g, "''")}', '${habit.description.replace(/'/g, "''")}', '${habit.type}', '${habit.cadence}', ${daysSql}, '${habit.completionMode}', ${targetSql}, ${scheduledSql}, '${MOCK_SEED_TIMESTAMP}', '${MOCK_SEED_TIMESTAMP}')`;
  })
  .join(",\n")};

INSERT OR IGNORE INTO habit_cue (id, habit_id, kind, payload) VALUES
${mockCueSeed
  .map(
    (cue) =>
      `  (${cue.id}, ${cue.habitId}, '${cue.kind}', '${cue.text.replace(/'/g, "''")}')`,
  )
  .join(",\n")};

INSERT OR IGNORE INTO habit_reward (id, habit_id, kind, payload) VALUES
${mockRewardSeed
  .map(
    (reward) =>
      `  (${reward.id}, ${reward.habitId}, '${reward.kind}', '{"points":${reward.points}}')`,
  )
  .join(",\n")};

INSERT OR IGNORE INTO habit_completion (id, habit_id, completed_at, slot_time) VALUES
${mockCompletionSeed
  .map((completion) => {
    const slotSql = completion.slotTime ? `'${completion.slotTime}'` : "NULL";
    return `  (${completion.id}, ${completion.habitId}, '${completion.completedAt}', ${slotSql})`;
  })
  .join(",\n")};

INSERT OR IGNORE INTO habit_stack (id, predecessor_id, successor_id, created_at, updated_at) VALUES
  (${mockStackSeed.id}, ${mockStackSeed.predecessorId}, ${mockStackSeed.successorId}, '${MOCK_SEED_TIMESTAMP}', '${MOCK_SEED_TIMESTAMP}');

UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM habit) WHERE name = 'habit';
UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM habit_cue) WHERE name = 'habit_cue';
UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM habit_reward) WHERE name = 'habit_reward';
UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM habit_completion) WHERE name = 'habit_completion';
UPDATE sqlite_sequence SET seq = (SELECT MAX(id) FROM habit_stack) WHERE name = 'habit_stack';
`;
