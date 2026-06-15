# Schema V1 Draft

This document defines the first durable data shape for Luna Body Tracker.

The schema should support:

- Daily aggregated records
- System modules
- User custom modules
- Soft deletion
- JSONL import/export
- AI-agent-readable module metadata
- Future migration

## DailyRecord

```ts
export type DailyRecord = {
  id: string;
  date: string;
  timezone: string;
  schemaVersion: 1;
  modules: Record<string, ModuleValue>;
  meta: DailyRecordMeta;
};
```

Example:

```json
{
  "id": "daily_2026-06-14",
  "date": "2026-06-14",
  "timezone": "Asia/Shanghai",
  "schemaVersion": 1,
  "modules": {
    "mood": { "value": "grin" },
    "water": { "value": 2, "unit": "bowl", "targetValue": 8 },
    "sleep": { "value": 3, "unit": "hour" },
    "weight": { "kg": 73 },
    "poop": { "count": 2, "label": "2" },
    "note": {
      "text": "昨晚一点多睡，早上六点起看球赛。\n吃得不太健康，没有暴食，但是吃了很多高热量的食物。"
    }
  },
  "meta": {
    "recordedModuleIds": ["mood", "water", "sleep", "weight", "poop", "note"],
    "source": "extension",
    "createdAt": "2026-06-14T00:00:00+08:00",
    "updatedAt": "2026-06-14T23:59:00+08:00"
  }
}
```

## DailyRecordMeta

```ts
export type RecordSource =
  | "extension"
  | "web"
  | "ai_skill"
  | "device"
  | "import";

export type DailyRecordMeta = {
  recordedModuleIds: string[];
  source: RecordSource;
  createdAt: string;
  updatedAt: string;
};
```

## ModuleDefinition

```ts
export type ModuleOrigin = "system" | "user" | "plugin";

export type ModuleLifecycle =
  | "visible"
  | "hidden"
  | "deleted"
  | "inactive"
  | "deprecated";

export type ModuleCategory =
  | "body"
  | "mind"
  | "intake"
  | "cycle"
  | "note"
  | "custom";

export type ModuleSensitivity =
  | "normal"
  | "personal"
  | "sensitive";

export type ModuleDefinition = {
  id: string;
  key?: string;
  title: string;
  origin: ModuleOrigin;
  category: ModuleCategory;
  sensitivity: ModuleSensitivity;
  lifecycle: ModuleLifecycle;
  canHide: boolean;
  canDelete: boolean;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};
```

## System Module Rules

System modules:

- have stable IDs
- cannot be deleted
- can be hidden
- are migrated by the core schema package

Initial system modules:

```text
mood
water
sleep
weight
foodPool
exercise
meals
poop
menstrual
note
```

## User Module Rules

User modules:

- can be created
- can be edited
- can be soft deleted
- should not be hard deleted while historical records reference them
- should remain available in export metadata

## ModuleValue Drafts

```ts
export type MoodValue = {
  value: string;
};

export type WaterValue = {
  value: number;
  unit: "bowl";
  targetValue?: number;
};

export type SleepValue = {
  value: number;
  unit: "hour";
};

export type WeightValue = {
  kg: number;
};

export type FoodPoolItem = {
  name: string;
  amount: number;
  label?: string;
};

export type FoodPoolValue = Record<string, FoodPoolItem>;

export type MealsValue = {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snack?: string;
};

export type PoopValue = {
  count: number;
  label?: string;
  entries?: Array<{
    time?: string;
    note?: string;
  }>;
};

export type MenstrualValue = {
  status?: "period" | "spotting" | "none" | "unknown";
  flow?: "light" | "medium" | "heavy";
  symptoms?: string[];
  note?: string;
};

export type NoteValue = {
  text: string;
};

export type ModuleValue =
  | MoodValue
  | WaterValue
  | SleepValue
  | WeightValue
  | FoodPoolValue
  | MealsValue
  | PoopValue
  | MenstrualValue
  | NoteValue
  | Record<string, unknown>;
```

## Derived Cycle Context

Cycle context is derived data. It should not be required in the raw daily record.

```ts
export type CycleContext = {
  cycleDay?: number;
  daysBeforePeriod?: number;
  phase?:
    | "menstrual"
    | "follicular"
    | "ovulation"
    | "luteal"
    | "unknown";
};
```

## Export Format

JSONL is the durable export format.

Each line may represent one object:

```text
module_definition
daily_record
settings
```

Draft envelope:

```ts
export type ExportLine =
  | {
      type: "module_definition";
      version: 1;
      data: ModuleDefinition;
    }
  | {
      type: "daily_record";
      version: 1;
      data: DailyRecord;
    }
  | {
      type: "settings";
      version: 1;
      data: Record<string, unknown>;
    };
```

The existing extension export can be migrated into this envelope format.
