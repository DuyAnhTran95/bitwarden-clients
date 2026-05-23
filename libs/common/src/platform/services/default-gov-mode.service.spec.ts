import { firstValueFrom, of } from "rxjs";

import { Region } from "../abstractions/environment.service";

import { DefaultGovModeService } from "./default-gov-mode.service";

describe("DefaultGovModeService", () => {
  const createMockEnvironmentService = (region: Region) => ({
    environment$: of({
      getRegion: () => region,
    }),
  });

  describe("isGovMode$", () => {
    it("emits true when region is Gov", async () => {
      const envService = createMockEnvironmentService(Region.Gov);
      const sut = new DefaultGovModeService(envService as any);

      const result = await firstValueFrom(sut.isGovMode$);

      expect(result).toBe(true);
    });

    it.each([Region.US, Region.EU, Region.SelfHosted])(
      "emits false when region is %s",
      async (region) => {
        const envService = createMockEnvironmentService(region);
        const sut = new DefaultGovModeService(envService as any);

        const result = await firstValueFrom(sut.isGovMode$);

        expect(result).toBe(false);
      },
    );
  });

  describe("isGovMode", () => {
    it("returns true for Gov region", async () => {
      const envService = createMockEnvironmentService(Region.Gov);
      const sut = new DefaultGovModeService(envService as any);

      expect(await sut.isGovMode()).toBe(true);
    });

    it.each([Region.US, Region.EU, Region.SelfHosted])(
      "returns false when region is %s",
      async (region) => {
        const envService = createMockEnvironmentService(region);
        const sut = new DefaultGovModeService(envService as any);

        expect(await sut.isGovMode()).toBe(false);
      },
    );
  });
});
