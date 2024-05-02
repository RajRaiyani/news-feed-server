-- migrate:up
create or replace function match_score(doc varchar,tags text[])
returns int
as
$$
declare
	count int := 0;
	tag text;
begin
	foreach tag in array tags loop
		IF doc ~* tag THEN
            count := count + 1;
        END IF;
	end loop;
	return count;
end;
$$
language plpgsql;


create table if not exists "feed"(
	"id" UUID DEFAULT GEN_RANDOM_UUID(),
	"title" varchar(500) not null,
	"publishedAt" timestamp without time zone not null,
	"document" varchar(2000) not null,
	"content" varchar(10000) not null,
	constraint "pk_feed" primary key ("id")
);


create unique index if not exists "uc_feed_title_publishedAt" on "feed" ("title","publishedAt");

-- migrate:down

drop index if exists "uc_feed_title_publishedAt";

drop table if exists "feed";

drop function if exists match_score(doc varchar, tags text[]);

