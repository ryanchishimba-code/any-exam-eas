import { describe, expect, it } from "vitest";
import { FNP_QUICK_BITE_EPISODES } from "@/lib/quick-bites/fnp-catalog";
import { PANCE_QUICK_BITE_EPISODES } from "@/lib/quick-bites/pance-catalog";
import {
  QB_FNP_PANCE_MAX_UPLOAD_BYTES,
  QB_FNP_PANCE_UPLOAD_PATHS,
  contentTypeForFnpPancePath,
  fnpPanceClientTokenConstraints,
} from "@/lib/quick-bites/fnp-pance-upload-plan";

describe("Quick Bites FNP/PANCE upload plan", () => {
  it("allows exactly 76 pathnames with matching content types", () => {
    expect(QB_FNP_PANCE_UPLOAD_PATHS.size).toBe(76);
    expect(FNP_QUICK_BITE_EPISODES.length).toBe(18);
    expect(PANCE_QUICK_BITE_EPISODES.length).toBe(20);
    for (const [pathname, type] of QB_FNP_PANCE_UPLOAD_PATHS) {
      expect(contentTypeForFnpPancePath(pathname)).toBe(type);
      expect(pathname.startsWith("quick-bites-fnp/") || pathname.startsWith("quick-bites-pance/")).toBe(
        true
      );
      expect(pathname).toContain("/v1-20261025/");
    }
  });

  it("returns token constraints for allowed paths only", () => {
    const sample = [...QB_FNP_PANCE_UPLOAD_PATHS.keys()][0]!;
    expect(fnpPanceClientTokenConstraints(sample)).toEqual({
      allowedContentTypes: [QB_FNP_PANCE_UPLOAD_PATHS.get(sample)!],
      maximumSizeInBytes: QB_FNP_PANCE_MAX_UPLOAD_BYTES,
      addRandomSuffix: false,
      allowOverwrite: false,
    });
    expect(() => fnpPanceClientTokenConstraints("quick-bites/quick-bites-ep02-nclex-works-web.mp4")).toThrow(
      "Path is not in the FNP/PANCE upload plan"
    );
  });
});
