WITH ranked_heroes AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY player_id
      ORDER BY created_at DESC, id DESC
    ) AS rank
  FROM heroes
), duplicate_heroes AS (
  SELECT id
  FROM ranked_heroes
  WHERE rank > 1
), deleted_duplicate_hero_items AS (
  DELETE FROM items
  USING inventories, duplicate_heroes
  WHERE items.id = inventories.item_id
    AND inventories.hero_id = duplicate_heroes.id
)
DELETE FROM heroes
USING duplicate_heroes
WHERE heroes.id = duplicate_heroes.id;

CREATE UNIQUE INDEX "heroes_player_id_unique" ON "heroes" USING btree ("player_id");

-- Verification query (post-migration): orphan_item_count should be 0.
-- SELECT COUNT(*) AS orphan_item_count
-- FROM items i
-- LEFT JOIN inventories inv ON inv.item_id = i.id
-- WHERE inv.item_id IS NULL;
