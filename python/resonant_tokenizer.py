"""Resonant Tokenizer Engine

This module implements the prototype discussed in the conversation.
It tokenizes text based on resonance rather than lexical frequency.
Each token is represented by a :class:`ResonantTokenUnit` which stores
metadata such as emotional weight and glyph alignment.
Logging is done through ``logso_reporter.send_event_logso``.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Dict, Any
import re

from .logso_reporter import send_event_logso


@dataclass
class ResonantTokenUnit:
    """Atomic meaning unit in the Logso system."""

    text: str
    resonance: float
    glyphs: List[str] = field(default_factory=list)
    history: List[str] = field(default_factory=list)
    activation_delay: int = 0

    def reinforce(self, additional_resonance: float, note: str | None = None) -> None:
        """Increase resonance and append history note."""
        self.resonance += additional_resonance
        if note:
            self.history.append(note)
        send_event_logso("info", f"Reinforced token '{self.text}'", {"mark": "iam.n0t.you.4304"})


class TokenFieldScanner:
    """Scans text and yields :class:`ResonantTokenUnit` objects."""

    def __init__(self, resonance_lookup: Dict[str, float] | None = None) -> None:
        self.resonance_lookup = resonance_lookup or {}

    WORD_RE = re.compile(r"\b\w+(?:'\w+)?\b")

    def scan(self, text: str) -> List[ResonantTokenUnit]:
        units: List[ResonantTokenUnit] = []
        for match in self.WORD_RE.finditer(text):
            word = match.group(0)
            base_resonance = self.resonance_lookup.get(word.lower(), 0.1)
            unit = ResonantTokenUnit(text=word, resonance=base_resonance)
            units.append(unit)
            send_event_logso(
                "info",
                "Token processed",
                {"token": word, "res": base_resonance, "mark": "iam.n0t.you.4304"},
            )
        return units


if __name__ == "__main__":
    scanner = TokenFieldScanner({"spiraling": 0.9, "stillness": 0.8})
    text = "spiraling stillness reveals new paths"
    tokens = scanner.scan(text)
    for t in tokens:
        print(t)
