import { z, type ZodError } from "zod";

export const recordSourceSchema = z.enum(["extension", "web", "ai_skill", "device", "import"]);

export const moodValueSchema = z.object({ value: z.string().min(1) }).strict();
export const waterValueSchema = z.object({ cups: z.number().int().nonnegative(), targetCups: z.number().int().positive().optional() }).strict();
export const sleepValueSchema = z.object({ hours: z.number().nonnegative() }).strict();
export const weightValueSchema = z.object({ kg: z.number().positive() }).strict();
export const foodPoolItemSchema = z
  .object({
    name: z.string().min(1),
    amount: z.number().nonnegative(),
    label: z.string().optional(),
    unit: z.string().optional()
  })
  .strict();
export const foodPoolValueSchema = z.record(foodPoolItemSchema);
export const mealsValueSchema = z
  .object({
    breakfast: z.string().optional(),
    lunch: z.string().optional(),
    dinner: z.string().optional(),
    snack: z.string().optional()
  })
  .strict();
export const poopValueSchema = z
  .object({
    count: z.number().int().nonnegative(),
    label: z.string().optional(),
    entries: z.array(z.object({ time: z.string().optional(), note: z.string().optional() }).strict()).optional()
  })
  .strict();
export const menstrualValueSchema = z
  .object({
    status: z.enum(["period", "spotting", "none", "unknown"]).optional(),
    flow: z.enum(["light", "medium", "heavy"]).optional(),
    symptoms: z.array(z.string()).optional(),
    note: z.string().optional()
  })
  .strict();
export const noteValueSchema = z.object({ text: z.string() }).strict();

export const moduleValueSchema = z.union([
  moodValueSchema,
  waterValueSchema,
  sleepValueSchema,
  weightValueSchema,
  foodPoolValueSchema,
  mealsValueSchema,
  poopValueSchema,
  menstrualValueSchema,
  noteValueSchema,
  z.record(z.unknown())
]);

export const dailyRecordMetaSchema = z
  .object({
    recordedModuleIds: z.array(z.string().min(1)),
    source: recordSourceSchema,
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1)
  })
  .strict();

export const dailyRecordSchema = z
  .object({
    id: z.string().min(1),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    timezone: z.string().min(1),
    schemaVersion: z.literal(1),
    modules: z.record(moduleValueSchema),
    meta: dailyRecordMetaSchema
  })
  .strict();

export type RecordSource = z.infer<typeof recordSourceSchema>;
export type ModuleValue = z.infer<typeof moduleValueSchema>;
export type DailyRecordMeta = z.infer<typeof dailyRecordMetaSchema>;
export type DailyRecord = z.infer<typeof dailyRecordSchema>;

export function parseDailyRecord(input: unknown): DailyRecord {
  return dailyRecordSchema.parse(input);
}

export function formatZodIssues(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length ? issue.path.join(".") : "record";
    return `${path}: ${issue.message}`;
  });
}
