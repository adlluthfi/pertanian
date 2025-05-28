<?php

class RateLimiter {
    private $attempts = [];
    private $timestamps = [];
    private $maxAttempts;
    private $decayMinutes;

    public function __construct($maxAttempts = 5, $decayMinutes = 15) {
        $this->maxAttempts = $maxAttempts;
        $this->decayMinutes = $decayMinutes;
    }

    public function tooManyAttempts($key) {
        $this->cleanOldAttempts($key);
        return $this->attempts[$key] >= $this->maxAttempts;
    }

    public function hit($key) {
        if (!isset($this->attempts[$key])) {
            $this->attempts[$key] = 0;
            $this->timestamps[$key] = [];
        }
        
        $this->attempts[$key]++;
        $this->timestamps[$key][] = time();
    }

    private function cleanOldAttempts($key) {
        if (!isset($this->timestamps[$key])) {
            $this->attempts[$key] = 0;
            return;
        }

        $cutoff = time() - ($this->decayMinutes * 60);
        $this->timestamps[$key] = array_filter($this->timestamps[$key], function($timestamp) use ($cutoff) {
            return $timestamp >= $cutoff;
        });

        $this->attempts[$key] = count($this->timestamps[$key]);
    }

    public function availableIn($key) {
        if (!isset($this->timestamps[$key]) || empty($this->timestamps[$key])) {
            return 0;
        }

        $oldestAttempt = min($this->timestamps[$key]);
        return ($oldestAttempt + ($this->decayMinutes * 60)) - time();
    }
}