-- Category-specific product facts (fabric, care instructions, scent
-- description, ingredients, usage instructions, warnings, size guide)
-- kept as a single flexible jsonb column rather than per-category
-- tables. All keys are optional -- nothing here is required, and
-- nothing here is ever auto-generated (no invented medical/cosmetic
-- claims). The order-creation path never reads this column.

alter table products add column attributes jsonb not null default '{}'::jsonb;

comment on column products.attributes is
  'Optional category-specific facts as supplied by the admin, e.g. {"fabric": "...", "careInstructions": ["..."], "sizeGuide": "...", "scentDescription": "...", "ingredients": ["..."], "usageInstructions": ["..."], "warnings": ["..."]}. Never auto-generated.';
