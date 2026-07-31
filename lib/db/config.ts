export default {
    database: {
        path: "habits.db",
    },
    entities: {
        Item: "./entities/Item.ts",
        Inventory: "./entities/Inventory.ts",
        RewardOpenLog: "./entities/RewardOpenLog.ts",
        Habit: "./entities/Habit.ts",
        HabitCompletion: "./entities/HabitCompletion.ts",
        HabitCue: "./entities/HabitCue.ts",
        HabitReward: "./entities/HabitReward.ts",
        HabitStack: "./entities/HabitStack.ts",
    },
};