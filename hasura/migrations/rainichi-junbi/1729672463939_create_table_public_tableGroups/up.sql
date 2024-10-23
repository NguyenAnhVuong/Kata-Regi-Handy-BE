CREATE TABLE "public"."tableGroups" ("id" serial NOT NULL, "rootTableId" integer NOT NULL, "createdAt" time without time zone NOT NULL DEFAULT now(), PRIMARY KEY ("id") , UNIQUE ("id"));
