import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" ADD COLUMN "openrouter_api_key" varchar;
    ALTER TABLE "site_settings" ADD COLUMN "openrouter_model" varchar DEFAULT 'anthropic/claude-3.5-haiku';
    ALTER TABLE "site_settings" ADD COLUMN "openrouter_temperature" numeric DEFAULT 0.7;
    ALTER TABLE "site_settings" ADD COLUMN "openrouter_max_tokens" numeric DEFAULT 500;
    ALTER TABLE "site_settings" ADD COLUMN "openrouter_system_prompt" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN "openrouter_api_key";
    ALTER TABLE "site_settings" DROP COLUMN "openrouter_model";
    ALTER TABLE "site_settings" DROP COLUMN "openrouter_temperature";
    ALTER TABLE "site_settings" DROP COLUMN "openrouter_max_tokens";
    ALTER TABLE "site_settings" DROP COLUMN "openrouter_system_prompt";
  `)
}
