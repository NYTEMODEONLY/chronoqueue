CREATE TYPE "public"."action_type" AS ENUM('combat', 'train', 'quest', 'craft', 'rest');--> statement-breakpoint
CREATE TYPE "public"."combat_state" AS ENUM('idle', 'in_combat', 'victory', 'loot', 'defeat', 'respawn');--> statement-breakpoint
CREATE TYPE "public"."equipment_slot" AS ENUM('head', 'chest', 'legs', 'weapon', 'off_hand', 'accessory_1', 'accessory_2');--> statement-breakpoint
CREATE TYPE "public"."hero_class" AS ENUM('chronoknight', 'timestomper', 'epoch_mage', 'idlemaster', 'loot_gremlin', 'unflappable');--> statement-breakpoint
CREATE TYPE "public"."quest_status" AS ENUM('active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."quest_type" AS ENUM('kill', 'collection', 'milestone', 'boss');--> statement-breakpoint
CREATE TYPE "public"."weapon_type" AS ENUM('physical', 'magical');--> statement-breakpoint
CREATE TABLE "game_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"payload" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "heroes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"player_id" uuid NOT NULL,
	"name" text NOT NULL,
	"class" "hero_class" NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"xp" bigint DEFAULT 0 NOT NULL,
	"stats" jsonb NOT NULL,
	"hp" integer NOT NULL,
	"gold" bigint DEFAULT 0 NOT NULL,
	"current_zone" text DEFAULT '1-1' NOT NULL,
	"current_act" integer DEFAULT 1 NOT NULL,
	"combat_state" "combat_state" DEFAULT 'idle' NOT NULL,
	"deaths" integer DEFAULT 0 NOT NULL,
	"kills" integer DEFAULT 0 NOT NULL,
	"is_training" boolean DEFAULT false NOT NULL,
	"training_end_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_tick_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "inventories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_id" uuid NOT NULL,
	"item_id" uuid NOT NULL,
	"equipped" boolean DEFAULT false NOT NULL,
	"slot_index" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inventories_item_id_unique" UNIQUE("item_id")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slot" "equipment_slot" NOT NULL,
	"rarity_tier" smallint NOT NULL,
	"weapon_type" "weapon_type",
	"weapon_power" integer,
	"stat_bonuses" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"power_score" integer NOT NULL,
	"sell_price" integer NOT NULL,
	"zone_level" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "players" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"auth_id" text NOT NULL,
	"username" text NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_seen_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "players_auth_id_unique" UNIQUE("auth_id"),
	CONSTRAINT "players_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "quest_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_id" uuid NOT NULL,
	"quest_id" uuid NOT NULL,
	"status" "quest_status" DEFAULT 'active' NOT NULL,
	"progress" jsonb DEFAULT '{"current":0,"target":0}'::jsonb NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "quests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"quest_type" "quest_type" NOT NULL,
	"act" integer NOT NULL,
	"zone" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"requirements" jsonb NOT NULL,
	"rewards" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "queue_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hero_id" uuid NOT NULL,
	"action_type" "action_type" NOT NULL,
	"target_id" text,
	"position" integer NOT NULL,
	"started_at" timestamp with time zone,
	"completes_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "game_events" ADD CONSTRAINT "game_events_hero_id_heroes_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."heroes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "heroes" ADD CONSTRAINT "heroes_player_id_players_id_fk" FOREIGN KEY ("player_id") REFERENCES "public"."players"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_hero_id_heroes_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."heroes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_hero_id_heroes_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."heroes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quest_progress" ADD CONSTRAINT "quest_progress_quest_id_quests_id_fk" FOREIGN KEY ("quest_id") REFERENCES "public"."quests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_slots" ADD CONSTRAINT "queue_slots_hero_id_heroes_id_fk" FOREIGN KEY ("hero_id") REFERENCES "public"."heroes"("id") ON DELETE cascade ON UPDATE no action;