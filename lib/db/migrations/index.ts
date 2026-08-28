import { tableRowCount } from "../sqliteHelpers";
import { SEED_MOCK_DATA_ID, SEED_MOCK_DATA_SQL } from "./001_seed_mock_data";
import {
  ADD_HABIT_SCHEDULE_ID,
  upAddHabitSchedule,
} from "./002_add_habit_schedule";
import {
  MULTI_COMPLETION_ID,
  upMultiCompletion,
} from "./003_multi_completion";
import {
  DROP_TIME_OF_DAY_ID,
  upDropTimeOfDay,
} from "./004_drop_time_of_day";

export type Migration = {
  id: string;
  up: (sqlite3: SQLiteAPI, db: number) => Promise<void>;
};

export const migrations: Migration[] = [
  {
    id: SEED_MOCK_DATA_ID,
    up: async (sqlite3, db) => {
      if ((await tableRowCount(sqlite3, db, "habit")) > 0) {
        return;
      }
      await sqlite3.exec(db, SEED_MOCK_DATA_SQL);
    },
  },
  {
    id: ADD_HABIT_SCHEDULE_ID,
    up: upAddHabitSchedule,
  },
  {
    id: MULTI_COMPLETION_ID,
    up: upMultiCompletion,
  },
  {
    id: DROP_TIME_OF_DAY_ID,
    up: upDropTimeOfDay,
  },
];
