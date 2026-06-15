import { z } from "zod";

export const moduleOriginSchema = z.enum(["system", "user", "plugin"]);
export const moduleLifecycleSchema = z.enum(["visible", "hidden", "deleted", "inactive", "deprecated"]);
export const moduleCategorySchema = z.enum(["body", "mind", "intake", "cycle", "note", "custom"]);
export const moduleSensitivitySchema = z.enum(["normal", "personal", "sensitive"]);

export const moduleDefinitionSchema = z
  .object({
    id: z.string().min(1),
    key: z.string().min(1).optional(),
    title: z.string().min(1),
    origin: moduleOriginSchema,
    category: moduleCategorySchema,
    sensitivity: moduleSensitivitySchema,
    lifecycle: moduleLifecycleSchema,
    canHide: z.boolean(),
    canDelete: z.boolean(),
    schemaVersion: z.number().int().positive(),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    deletedAt: z.string().min(1).optional()
  })
  .strict();

export type ModuleOrigin = z.infer<typeof moduleOriginSchema>;
export type ModuleLifecycle = z.infer<typeof moduleLifecycleSchema>;
export type ModuleCategory = z.infer<typeof moduleCategorySchema>;
export type ModuleSensitivity = z.infer<typeof moduleSensitivitySchema>;
export type ModuleDefinition = z.infer<typeof moduleDefinitionSchema>;

const systemModuleCreatedAt = "2026-06-15T00:00:00+08:00";

export const systemModuleDefinitions: ModuleDefinition[] = [
  createSystemModule("mood", "Mood", "mind", "personal"),
  createSystemModule("water", "Water", "intake", "normal"),
  createSystemModule("sleep", "Sleep", "body", "personal"),
  createSystemModule("weight", "Weight", "body", "sensitive"),
  createSystemModule("foodPool", "Food Pool", "intake", "personal"),
  createSystemModule("exercise", "Exercise", "body", "personal"),
  createSystemModule("meals", "Meals", "intake", "personal"),
  createSystemModule("poop", "Bowel Movement", "body", "sensitive"),
  createSystemModule("menstrual", "Menstrual Cycle", "cycle", "sensitive"),
  createSystemModule("note", "Note", "note", "personal")
];

function createSystemModule(
  id: string,
  title: string,
  category: ModuleCategory,
  sensitivity: ModuleSensitivity
): ModuleDefinition {
  return {
    id,
    title,
    origin: "system",
    category,
    sensitivity,
    lifecycle: "visible",
    canHide: true,
    canDelete: false,
    schemaVersion: 1,
    createdAt: systemModuleCreatedAt,
    updatedAt: systemModuleCreatedAt
  };
}
