"""All 100 Step 1 items."""

from p1a import ITEMS as A
from p1b import ITEMS as B
from p1c import ITEMS as C
from p1d import ITEMS as D
from p1e import ITEMS as E
from p1f import ITEMS as F
from p1g import ITEMS as G
from p1h import ITEMS as H
from p1i import ITEMS as I

from p1_fix import FIXES

ITEMS = A + B + C + D + E + F + G + H + I
_by_id = {row["id"]: row for row in ITEMS}
for row in FIXES:
    _by_id[row["id"]] = row
ITEMS = [_by_id[row["id"]] for row in ITEMS]
