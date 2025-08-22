<?php
// database/seeders/BackfillOrderCommissionsSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BackfillOrderCommissionsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('patient_visit_orders as o')
            ->leftJoin('patient_visits as v', 'v.id', '=', 'o.patient_visit_id')
            ->whereNull('o.commission_percentage')
            ->select('o.id', 'o.total_amount', 'v.professional_id')
            ->orderBy('o.id')
            ->chunk(1000, function ($rows) {
                foreach ($rows as $order) {
                    if (! $order->professional_id) {
                        continue; // sin profesional, no calculamos comisión
                    }

                    $professional = DB::table('professionals')
                        ->select('commission_percentage')
                        ->where('id', $order->professional_id)
                        ->first();

                    if (! $professional) {
                        continue;
                    }

                    $commissionPercentage = $professional->commission_percentage;
                    $commissionAmount = ($order->total_amount ?? 0) * ($commissionPercentage / 100);

                    // You may want to update the commission fields here, for example:
                    DB::table('patient_visit_orders')
                        ->where('id', $order->id)
                        ->update([
                            'commission_percentage' => $commissionPercentage,
                            'commission_amount' => $commissionAmount,
                        ]);
                }
            });

        // Now backfill professional_id where missing
        DB::table('patient_visit_orders as o')
            ->leftJoin('patient_visits as v', 'v.id', '=', 'o.patient_visit_id')
            ->whereNull('o.professional_id')
            ->select('o.id', 'v.professional_id')
            ->orderBy('o.id')
            ->chunk(1000, function ($rows) {
                foreach ($rows as $row) {
                    if (! $row->professional_id) continue;

                    DB::table('patient_visit_orders')
                        ->where('id', $row->id)
                        ->update(['professional_id' => $row->professional_id]);
                }
            });

        $this->command->info("✅ Backfill de professional_id completado en patient_visit_orders.");
    }
}