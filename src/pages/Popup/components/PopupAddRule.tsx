import { useState } from "react";
import {
  Badge,
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useOptionsContext, useTranslation } from "@/contexts";
import {
  ruleTypes,
  sourceTypes,
  ruleTypeSettings,
  sourceTypeSettings,
  RuleType,
} from "@/options/constants";
import { Label, Rule } from "@/options/types";

interface PopupAddRuleProps {
  currentUrl: string;
}

function PopupAddRule({ currentUrl }: PopupAddRuleProps) {
  const { options, dispatch } = useOptionsContext();
  const { t } = useTranslation();

  // Extract hostname from URL for default value
  const defaultHostname = (() => {
    try {
      const urlWithProtocol = currentUrl.startsWith("http")
        ? currentUrl
        : `https://${currentUrl}`;
      const url = new URL(urlWithProtocol);
      return url.hostname;
    } catch {
      return "";
    }
  })();

  const [selectedLabelId, setSelectedLabelId] = useState<string>("");
  const [ruleSource, setRuleSource] =
    useState<"hostname" | "fullUrl">("hostname");
  const [ruleType, setRuleType] = useState<RuleType>("matches");
  const [ruleValue, setRuleValue] = useState<string>(defaultHostname);

  // Check if no labels exist
  if (options.labels.length === 0) {
    return (
      <Text size="xs" c="dimmed" ta="center">
        {t("popup_noLabels")}
      </Text>
    );
  }

  // Label select options
  const labelOptions = options.labels.map((label) => ({
    value: label.id,
    label: label.name || t("common_noname"),
  }));

  // Source select options
  const sourceOptions = sourceTypes.map((source) => ({
    value: source,
    label: t(sourceTypeSettings[source].labelKey),
  }));

  // Type select options
  const typeOptions = ruleTypes.map((type) => ({
    value: type,
    label: t(ruleTypeSettings[type].labelKey),
  }));

  // Custom render function for Select options with Badge
  const renderLabelOption = ({
    option,
  }: {
    option: { value: string; label: string };
  }) => {
    const label = options.labels.find((l) => l.id === option.value);
    if (!label) {
      return <Text>{option.label}</Text>;
    }

    return (
      <Badge
        size="sm"
        p={10}
        style={{
          backgroundColor: label.bgColor,
          color: label.textColor,
        }}
      >
        {label.name || t("common_noname")}
      </Badge>
    );
  };

  const handleAdd = () => {
    if (!selectedLabelId || !ruleValue.trim()) {
      return;
    }

    const label = options.labels.find((l) => l.id === selectedLabelId);
    if (!label) {
      return;
    }

    const newRule: Rule = {
      type: ruleType,
      value: ruleValue.trim(),
      source: ruleSource,
    };

    const updatedLabel: Label = {
      ...label,
      rules: [...label.rules, newRule],
    };

    dispatch({
      type: "updateLabel",
      payload: { label: updatedLabel },
    });

    // Parent component will automatically re-render and show matched view
    // because options context changed, triggering useEffect that re-matches
  };

  return (
    <Stack gap={8}>
      <Text size="xs" fw={500} c="dimmed">
        {t("popup_addRuleTitle")}
      </Text>

      <Select
        size="xs"
        label={t("popup_selectLabel")}
        placeholder={t("popup_selectLabel_placeholder")}
        data={labelOptions}
        value={selectedLabelId}
        onChange={(value) => setSelectedLabelId(value || "")}
        renderOption={renderLabelOption}
        allowDeselect={false}
      />

      <Group gap={6} grow>
        <Select
          size="xs"
          label={t("popup_ruleSource")}
          data={sourceOptions}
          value={ruleSource}
          onChange={(value) =>
            setRuleSource((value as "hostname" | "fullUrl") || "hostname")
          }
          allowDeselect={false}
        />
        <Select
          size="xs"
          label={t("popup_ruleType")}
          data={typeOptions}
          value={ruleType}
          onChange={(value) => setRuleType((value as RuleType) || "matches")}
          allowDeselect={false}
        />
      </Group>

      <TextInput
        size="xs"
        label={t("popup_ruleValue")}
        value={ruleValue}
        onChange={(e) => setRuleValue(e.currentTarget.value)}
        placeholder={defaultHostname}
      />

      <Button
        size="xs"
        fullWidth
        leftSection={<IconPlus size={14} />}
        onClick={handleAdd}
        disabled={!selectedLabelId || !ruleValue.trim()}
      >
        {t("popup_addRule")}
      </Button>
    </Stack>
  );
}

export default PopupAddRule;
