class ResonanceCalculator:
    """Simple resonance calculator"""

    def __init__(self, values):
        self.values = values

    def score(self):
        if not self.values:
            return 0
        return sum(self.values) / len(self.values)


def main():
    calc = ResonanceCalculator([1, 2, 3, 4])
    print("Resonance score:", calc.score())


if __name__ == "__main__":
    main()
