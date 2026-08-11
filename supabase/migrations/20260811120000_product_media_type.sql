-- Product media can now be an image or a video (e.g. a short product
-- clip shown in the PDP gallery alongside photos). Existing rows are
-- all photos, so they default to 'image' with no backfill needed.
alter table product_media
  add column media_type text not null default 'image' check (media_type in ('image', 'video'));
