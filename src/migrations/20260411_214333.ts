import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cv" ADD COLUMN "page_title" varchar DEFAULT 'Curriculum Vitae';
  ALTER TABLE "cv" ADD COLUMN "page_description" varchar;
  ALTER TABLE "_cv_v" ADD COLUMN "version_page_title" varchar DEFAULT 'Curriculum Vitae';
  ALTER TABLE "_cv_v" ADD COLUMN "version_page_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cv" DROP COLUMN "page_title";
  ALTER TABLE "cv" DROP COLUMN "page_description";
  ALTER TABLE "_cv_v" DROP COLUMN "version_page_title";
  ALTER TABLE "_cv_v" DROP COLUMN "version_page_description";`)
}
