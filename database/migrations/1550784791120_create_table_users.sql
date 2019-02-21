create sequence "Users_id_seq";

create table public."Users" (
  id          integer      not null default nextval('"Users_id_seq"'::regclass),
  email       varchar(100) not null,
  first_name  varchar(100) not null,
  last_name   varchar(100) not null,
  password    varchar(500) not null,
  "createdAt" timestamptz  not null,
  "updatedAt" timestamptz  not null
);
---

drop table public."Users";

drop sequence "Users_id_seq";
