#!/bin/bash
# Reset all tune data in the database.
# Run from the project root: ./reset-db.sh

echo "This will delete ALL tunes, settings, collections, composers, and tune types."
read -p "Are you sure? (y/n) " confirm
if [ "$confirm" != "y" ]; then
    echo "Cancelled."
    exit 0
fi

php artisan tinker --execute="
    DB::table('collection_tunes')->truncate();
    App\Models\Setting::truncate();
    App\Models\Tune::truncate();
    App\Models\Collection::truncate();
    App\Models\TuneType::truncate();
    App\Models\Composer::truncate();
    echo 'Done. All tune data cleared.';
"
