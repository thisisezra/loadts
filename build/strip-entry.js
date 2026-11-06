import { transformSync } from "amaro";
self.tsStrip = (code, filename) => transformSync(code, { mode: "strip-only", filename }).code;
