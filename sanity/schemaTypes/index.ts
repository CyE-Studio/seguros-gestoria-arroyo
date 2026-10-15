import type { SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContent";
import { campanaType } from "./campana";

export const schemaTypes: SchemaTypeDefinition[] = [campanaType, blockContentType];
