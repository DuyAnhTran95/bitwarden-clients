import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from "@angular/forms";

import { SendFileView } from "@bitwarden/common/tools/send/models/view/send-file.view";
import { SendType } from "@bitwarden/common/tools/send/types/send-type";
import {
  ButtonModule,
  FileUploadComponent,
  FormFieldModule,
  SectionComponent,
  TypographyModule,
} from "@bitwarden/components";
import { I18nPipe } from "@bitwarden/ui-common";

import { SendFormService } from "../../abstractions/send-form.service";

// FIXME(https://bitwarden.atlassian.net/browse/CL-764): Migrate to OnPush
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: "tools-send-file-details",
  templateUrl: "./send-file-details.component.html",
  imports: [
    ButtonModule,
    CommonModule,
    FileUploadComponent,
    FormFieldModule,
    FormsModule,
    I18nPipe,
    ReactiveFormsModule,
    SectionComponent,
    TypographyModule,
  ],
})
export class SendFileDetailsComponent implements OnInit {
  protected sendFormService = inject(SendFormService);
  private formBuilder = inject(FormBuilder);

  sendFileDetailsForm = this.formBuilder.group({
    file: this.formBuilder.control<SendFileView | null>(null, Validators.required),
  });

  FileSendType = SendType.File;
  selectedFiles: File[] = [];

  constructor() {
    this.sendFormService.registerChildForm("sendFileDetailsForm", this.sendFileDetailsForm);

    this.sendFileDetailsForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.sendFormService.patchSend((send) => {
        return Object.assign(send, {
          file: value.file,
        });
      });
    });
  }

  onFilesChanged = (files: File[]): void => {
    const file = files[0];
    if (!file) {
      return;
    }
    this.sendFormService.setFile(file);
  };

  ngOnInit() {
    if (this.sendFormService.originalSendView) {
      this.sendFileDetailsForm.patchValue({
        file: this.sendFormService.originalSendView?.file,
      });
    }

    if (!this.sendFormService.sendFormConfig?.areSendsAllowed) {
      this.sendFileDetailsForm.disable();
    }
  }
}
