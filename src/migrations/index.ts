import * as migration_20260410_181404_init_schema from './20260410_181404_init_schema';
import * as migration_20260411_100147 from './20260411_100147';
import * as migration_20260411_214333 from './20260411_214333';
import * as migration_20260412_120000_openrouter_settings from './20260412_120000_openrouter_settings';
import * as migration_20260412_123355 from './20260412_123355';
import * as migration_20260412_150000_richtext_body_fields from './20260412_150000_richtext_body_fields';
import * as migration_20260414_120000_unified_link_system from './20260414_120000_unified_link_system';

export const migrations = [
  {
    up: migration_20260410_181404_init_schema.up,
    down: migration_20260410_181404_init_schema.down,
    name: '20260410_181404_init_schema',
  },
  {
    up: migration_20260411_100147.up,
    down: migration_20260411_100147.down,
    name: '20260411_100147',
  },
  {
    up: migration_20260411_214333.up,
    down: migration_20260411_214333.down,
    name: '20260411_214333',
  },
  {
    up: migration_20260412_120000_openrouter_settings.up,
    down: migration_20260412_120000_openrouter_settings.down,
    name: '20260412_120000_openrouter_settings',
  },
  {
    up: migration_20260412_123355.up,
    down: migration_20260412_123355.down,
    name: '20260412_123355'
  },
  {
    up: migration_20260412_150000_richtext_body_fields.up,
    down: migration_20260412_150000_richtext_body_fields.down,
    name: '20260412_150000_richtext_body_fields',
  },
  {
    up: migration_20260414_120000_unified_link_system.up,
    down: migration_20260414_120000_unified_link_system.down,
    name: '20260414_120000_unified_link_system',
  },
];
