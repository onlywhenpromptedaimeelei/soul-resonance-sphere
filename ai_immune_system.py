"""AI Immune System prototype with humoral and cellular components."""

from dataclasses import dataclass, field
from typing import Callable, Dict, List

from logso_reporter import send_event_logso


@dataclass
class ThreatSignature:
    """Represents a potential threat pattern for the AI."""

    id: str
    pattern: str
    metadata: Dict[str, str] = field(default_factory=dict)


class HumoralLayer:
    """Distributed response layer analogous to the humoral immune system."""

    def __init__(self):
        self.antibodies: Dict[str, Callable[[str], None]] = {}

    def register_antibody(
        self, signature: ThreatSignature, action: Callable[[str], None]
    ):
        send_event_logso("info", f"Registering antibody for {signature.id}")
        self.antibodies[signature.id] = action

    def neutralize(self, signature: ThreatSignature, data: str):
        action = self.antibodies.get(signature.id)
        if action:
            send_event_logso("info", f"Humoral response triggered for {signature.id}")
            action(data)
        else:
            send_event_logso("warn", f"No antibody for {signature.id}")


class CellularLayer:
    """Localized agent responses analogous to T-cells."""

    def __init__(self):
        self.cells: List[Callable[[str], None]] = []

    def register_cell(self, action: Callable[[str], None]):
        self.cells.append(action)
        send_event_logso("info", "Registered cellular agent")

    def engage(self, data: str):
        send_event_logso("info", "Cellular response engaged")
        for action in self.cells:
            action(data)


def simple_quarantine(data: str):
    send_event_logso("info", f"Quarantining data: {data}")


def direct_delete(data: str):
    send_event_logso("info", f"Deleting data: {data}")


if __name__ == "__main__":
    # Example usage
    spike = ThreatSignature(id="SPK-X1", pattern="spike-like")
    humoral = HumoralLayer()
    cellular = CellularLayer()

    humoral.register_antibody(spike, simple_quarantine)
    cellular.register_cell(direct_delete)

    # Simulated threat detection
    incoming_data = "suspicious spike-like payload"
    humoral.neutralize(spike, incoming_data)
    cellular.engage(incoming_data)
