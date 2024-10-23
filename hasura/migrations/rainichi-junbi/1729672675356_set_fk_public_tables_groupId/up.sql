alter table "public"."tables"
  add constraint "tables_groupId_fkey"
  foreign key ("groupId")
  references "public"."tableGroups"
  ("id") on update restrict on delete restrict;
