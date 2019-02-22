create table transactions (
  transaction_id     serial,
  amount             double precision not null,
  private_admin_note varchar(1000),
  user_id            integer,
  primary key (transaction_id),
  foreign key (user_id)
    references users (user_id)
     on update cascade
);

select util.add_timestamps('transactions');
---

drop table transactions;
