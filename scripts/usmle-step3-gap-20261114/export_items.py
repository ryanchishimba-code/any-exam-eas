"""Print the Step 3 gap batch as JSON on stdout."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from blood import ITEMS as BLOOD
from msk import ITEMS as MSK
from behavioral import ITEMS as BEHAVIORAL
from multi import ITEMS as MULTI
from rest import ITEMS as REST

def main() -> None:
    json.dump(BLOOD + MSK + BEHAVIORAL + MULTI + REST, sys.stdout)


if __name__ == "__main__":
    main()
