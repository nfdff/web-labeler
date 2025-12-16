import { useEffect } from "react";
import { Stack, Fieldset, Flex, Text } from "@mantine/core";
import { useTranslation } from "@/contexts";
import IconStyleSwitcher from "./IconStyleSwitcher";
import IconOnlyToggle from "./IconOnlyToggle";
import IconPreview from "../../IconPreview";
import { useLabelEditFormContext } from "../formContext.ts";

function LabelEditFormIcon() {
  const form = useLabelEditFormContext();
  const { t } = useTranslation();

  // Automatically turn off icon-only mode when favicon styling is set to "none"
  useEffect(() => {
    if (form.values.iconStyle === "none" && form.values.iconOnly) {
      form.setFieldValue("iconOnly", false);
    }
  }, [form.values.iconStyle]);

  return (
    <Flex gap="sm" wrap="wrap">
      <Fieldset
        legend={t("label_settings")}
        style={{
          flexGrow: 1,
          position: "relative",
          paddingBottom: "var(--mantine-spacing-xl)",
        }}
      >
        <Stack gap="sm">
          <Stack style={{ flexGrow: 1, gap: 0 }}>
            <Text size="sm" fw={500}>
              {t("label_faviconStyling")}
            </Text>
            <IconStyleSwitcher />
          </Stack>
          <IconOnlyToggle />
        </Stack>
      </Fieldset>
      <Fieldset legend={t("label_preview")} style={{ flexGrow: 1 }}>
        <IconPreview label={{ ...form.getValues() }} />
      </Fieldset>
    </Flex>
  );
}

export default LabelEditFormIcon;
