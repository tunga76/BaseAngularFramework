import { Injectable } from '@angular/core';

enum CircuitState {
    CLOSED,
    OPEN,
    HALF_OPEN
}

interface CircuitBreakerState {
    state: CircuitState;
    failures: number;
    lastFailureTime: number;
}

@Injectable({
    providedIn: 'root'
})
export class CircuitBreakerService {
    private circuits = new Map<string, CircuitBreakerState>();
    private readonly failureThreshold = 5;
    private readonly openDuration = 10000; // 10 seconds

    constructor() { }

    canRequest(key: string): boolean {
        const circuit = this.getCircuit(key);
        if (circuit.state === CircuitState.CLOSED) {
            return true;
        }
        if (circuit.state === CircuitState.OPEN) {
            if (Date.now() - circuit.lastFailureTime > this.openDuration) {
                circuit.state = CircuitState.HALF_OPEN;
                return true;
            }
            return false;
        }
        return circuit.state === CircuitState.HALF_OPEN;
    }

    recordSuccess(key: string): void {
        const circuit = this.getCircuit(key);
        if (circuit.state === CircuitState.HALF_OPEN) {
            this.reset(key);
        }
        // If closed, do nothing (or reset failures count if you want a sliding window, but simple count reset on success is safer for now)
        if (circuit.state === CircuitState.CLOSED) {
            circuit.failures = 0;
        }
    }

    recordFailure(key: string): void {
        const circuit = this.getCircuit(key);
        circuit.failures++;
        circuit.lastFailureTime = Date.now();

        if (circuit.state === CircuitState.HALF_OPEN) {
            circuit.state = CircuitState.OPEN;
        } else if (circuit.failures >= this.failureThreshold) {
            circuit.state = CircuitState.OPEN;
        }
    }

    private reset(key: string): void {
        this.circuits.set(key, {
            state: CircuitState.CLOSED,
            failures: 0,
            lastFailureTime: 0
        });
    }

    private getCircuit(key: string): CircuitBreakerState {
        if (!this.circuits.has(key)) {
            this.reset(key);
        }
        return this.circuits.get(key)!;
    }
}
