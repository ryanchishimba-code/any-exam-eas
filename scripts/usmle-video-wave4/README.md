# Wave 4 video release

Episodes 31–53 become visible by clearing `held` in `src/lib/quick-bites/usmle-video-catalog.ts`.
Playback still requires the existing production flags and a paid membership. This release writes no database rows.

`backup-pre-release-20261128/` is the catalog, tests, and sources from before `held` was cleared.
Undo: `sh scripts/usmle-video-wave4/01-undo-release.sh`. It restores those files. It does not change release flags and does not touch the database.
