<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;

trait LoggerTrait
{
    protected function logService(string $message, array $context = []): void
    {
        Log::info("[SERVICE][" . static::class . "] {$message}", $context);
    }

    protected function logController(string $message, array $context = []): void
    {
        Log::info("[CONTROLLER][" . static::class . "] {$message}", $context);
    }

    protected function logDebug(string $message, array $context = []): void
    {
        Log::debug("[DEBUG][" . static::class . "] {$message}", $context);
    }

    protected function logError(string $message, array $context = []): void
    {
        Log::error("[ERROR][" . static::class . "] {$message}", $context);
    }
}
