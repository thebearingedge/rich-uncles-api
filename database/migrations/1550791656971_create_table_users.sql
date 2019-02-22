create table users (
  user_id    serial,
  email      varchar(100) not null,
  first_name varchar(100) not null,
  last_name  varchar(100) not null,
  password   varchar(500) not null,
  primary key (user_id),
  unique (email)
);

select util.add_timestamps('users');
---

drop table users;
