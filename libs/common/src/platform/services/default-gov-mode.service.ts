import { Observable, firstValueFrom, map } from "rxjs";

import { EnvironmentService, Region } from "../abstractions/environment.service";
import { GovModeService } from "../abstractions/gov-mode.service";

export class DefaultGovModeService implements GovModeService {
  readonly isGovMode$: Observable<boolean>;

  constructor(private environmentService: EnvironmentService) {
    this.isGovMode$ = this.environmentService.environment$.pipe(
      map((env) => env.getRegion() === Region.Gov),
    );
  }

  async isGovMode(): Promise<boolean> {
    const env = await firstValueFrom(this.environmentService.environment$);
    return env.getRegion() === Region.Gov;
  }
}
