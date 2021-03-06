CREATE TABLE IF NOT EXISTS "researchers" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "institution" varchar(100) NOT NULL,
  "username" varchar(100) UNIQUE NOT NULL,
  "password" varchar(1000) NOT NULL,
  "email" varchar(320) UNIQUE NOT NULL,
  "verified" boolean NOT NULL DEFAULT false,
  "token" varchar(120) NOT NULL,
  "photo_loc" varchar(500),
  "bio" varchar(500)
);

CREATE TABLE IF NOT EXISTS  "algorithms" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar(100) NOT NULL,
  "version" int NOT NULL,
  "published" boolean NOT NULL,
  "publication" varchar(300),
  "insert_date" timestamp NOT NULL,
  "location" varchar(500),
  "description" varchar(2000)
);

CREATE TABLE IF NOT EXISTS "development" (
  "id" SERIAL PRIMARY KEY,
  "researcher_id" int NOT NULL,
  "algorithm_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "configuration" (
  "id" SERIAL PRIMARY KEY,
  "researcher_id" int NOT NULL,
  "parameters_id" int NOT NULL
);

CREATE TABLE IF NOT EXISTS "parameters" (
  "id" SERIAL PRIMARY KEY,
  "iterations" int,
  "datacenters_max" int,
  "datacenters_min" int,
  "datacenters_exact" int,
  "datacenters_flag" boolean NOT NULL,
  "hosts_max" int,
  "hosts_min" int,
  "hosts_exact" int,
  "hosts_flag" boolean NOT NULL,
  "hosts_pes_max" int,
  "hosts_pes_min" int,
  "hosts_pes_exact" int,
  "hosts_pes_flag" boolean NOT NULL,
  "hosts_ram_max" int,
  "hosts_ram_min" int,
  "hosts_ram_exact" int,
  "hosts_ram_flag" boolean NOT NULL,
  "hosts_bw_max" int,
  "hosts_bw_min" int,
  "hosts_bw_exact" int,
  "hosts_bw_flag" boolean NOT NULL,
  "hosts_hd_max" int,
  "hosts_hd_min" int,
  "hosts_hd_exact" int,
  "hosts_hd_flag" boolean NOT NULL,
  "vms_max" int,
  "vms_min" int,
  "vms_exact" int,
  "vms_flag" boolean NOT NULL,
  "vms_pes_max" int,
  "vms_pes_min" int,
  "vms_pes_exact" int,
  "vms_pes_flag" boolean NOT NULL,
  "vms_ram_max" int,
  "vms_ram_min" int,
  "vms_ram_exact" int,
  "vms_ram_flag" boolean NOT NULL,
  "vms_bw_max" int,
  "vms_bw_min" int,
  "vms_bw_exact" int,
  "vms_bw_flag" boolean NOT NULL,
  "vms_hd_max" int,
  "vms_hd_min" int,
  "vms_hd_exact" int,
  "vms_hd_flag" boolean NOT NULL,
  "cloudlets_max" int,
  "cloudlets_min" int,
  "cloudlets_exact" int,
  "cloudlets_flag" boolean NOT NULL,
  "cloudlets_pes_max" int,
  "cloudlets_pes_min" int,
  "cloudlets_pes_exact" int,
  "cloudlets_pes_flag" boolean NOT NULL,
  "cloudlets_length_max" int,
  "cloudlets_length_min" int,
  "cloudlets_length_exact" int,
  "cloudlets_length_flag" boolean NOT NULL
);

CREATE TABLE IF NOT EXISTS "simulations" (
  "id" SERIAL PRIMARY KEY,
  "date" timestamp NOT NULL,
  "researcher_id" int NOT NULL,
  "algorithm_id" int NOT NULL,
  "parameters_id" int NOT NULL,
  "token" varchar(20) NOT NULL,
  "compared_algorithm_id" int
);

CREATE TABLE IF NOT EXISTS "publications" (
  "id" SERIAL PRIMARY KEY,
  "simulation_id" int NOT NULL,
  "doi" varchar(50) NOT NULL
);

ALTER TABLE "development" ADD FOREIGN KEY ("researcher_id") REFERENCES "researchers" ("id");

ALTER TABLE "configuration" ADD FOREIGN KEY ("researcher_id") REFERENCES "researchers" ("id");

ALTER TABLE "development" ADD FOREIGN KEY ("algorithm_id") REFERENCES "algorithms" ("id");

ALTER TABLE "configuration" ADD FOREIGN KEY ("parameters_id") REFERENCES "parameters" ("id");

ALTER TABLE "simulations" ADD FOREIGN KEY ("researcher_id") REFERENCES "researchers" ("id");

ALTER TABLE "simulations" ADD FOREIGN KEY ("algorithm_id") REFERENCES "algorithms" ("id");

ALTER TABLE "simulations" ADD FOREIGN KEY ("parameters_id") REFERENCES "parameters" ("id");

ALTER TABLE "publications" ADD FOREIGN KEY ("simulation_id") REFERENCES "simulations" ("id");

ALTER TABLE "simulations" ADD FOREIGN KEY ("compared_algorithm_id") REFERENCES "algorithms" ("id");
