alter table "public"."tableGroups"
  add constraint "tableGroups_rootTableId_fkey"
  foreign key ("rootTableId")
  references "public"."tables"
  ("id") on update cascade on delete cascade;
