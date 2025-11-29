import { Button } from "@mantine/core";
import {
  LabelEditFormProps,
  LabelEditFormSection,
  LabelEditFormValues,
} from "./types.ts";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { useLabelEditForm, LabelEditFormProvider } from "./formContext.ts";
import LabelEditFormBadge from "./EditFormBadge";
import LabelEditFormRules from "./EditFormRules";
import { useCallback, useEffect } from "react";
import { editLabelFormInput } from "./formConfig.ts";
import { useOptionsContext } from "../../../contexts";
import LabelEditFormIcon from "./EditFormIcon";

function LabelEditForm({ label, onSave, section }: LabelEditFormProps) {
  const isNew = !label?.rules.length;
  const form = useLabelEditForm(editLabelFormInput(isNew));
  const { dispatch } = useOptionsContext();

  useEffect(() => {
    //todo: normalize form values (set default values for all optional fields)
    form.initialize({ ...form.values, ...label });
  }, [label]);

  const onFormSubmitHandler = useCallback(
    (values: LabelEditFormValues) => {
      dispatch(
        !label
          ? {
              type: "addLabel",
              payload: { label: { ...values, isActive: true } },
            }
          : {
              type: "updateLabel",
              payload: {
                label: { id: label.id, ...values, isActive: label.isActive },
              },
            },
      );
      if (onSave) {
        onSave();
      }
    },
    [dispatch, label, onSave],
  );

  return (
    <LabelEditFormProvider form={form}>
      <form onSubmit={form.onSubmit(onFormSubmitHandler)}>
        {section == LabelEditFormSection.Badge && <LabelEditFormBadge />}
        {section === LabelEditFormSection.Icon && <LabelEditFormIcon />}
        {section === LabelEditFormSection.Rules && <LabelEditFormRules />}
        <Button
          mt="md"
          type="submit"
          leftSection={<IconDeviceFloppy size={14} />}
        >
          Save
        </Button>
      </form>
    </LabelEditFormProvider>
  );
}

export default LabelEditForm;
