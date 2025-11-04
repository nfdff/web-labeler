import { Button, Flex, Select, Stack, TextInput } from "@mantine/core";
import { ruleTypes } from "../../../../options/constants.ts";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useLabelEditFormContext } from "../formContext.ts";
import { LabelEditFormValues } from "../types.ts";
import { UseFormReturnType } from "@mantine/form";

function LabelEditFormRules() {
  const form = useLabelEditFormContext();

  const handlePaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    path: string,
    form: UseFormReturnType<LabelEditFormValues>,
  ) => {
    const paste = event.clipboardData.getData("text");
    const cleaned = paste
      .replace(/^https?:\/\//, "") // remove http/https
      .replace(/\/.*$/, ""); // remove path and trailing slash
    event.preventDefault();
    form.setFieldValue(path, cleaned);
  };

  return (
    <Stack gap="xs">
      {form.getValues().rules.map((_item, index) => (
        <Flex key={`rule_${index}`} direction="row" gap="xs">
          <Select
            data={[...ruleTypes]}
            key={form.key(`rules.${index}.type`)}
            {...form.getInputProps(`rules.${index}.type`)}
            style={{ maxWidth: "120px" }}
            allowDeselect={false}
          />
          <TextInput
            placeholder="Domain or part (without protocol)"
            key={form.key(`rules.${index}.value`)}
            {...form.getInputProps(`rules.${index}.value`)}
            style={{ flexGrow: 1 }}
            onPaste={(event) =>
              handlePaste(event, `rules.${index}.value`, form)
            }
          />
          <Button
            color="gray"
            variant="light"
            p="xs"
            onClick={() => {
              form.removeListItem("rules", index);
            }}
          >
            <IconTrash size={14}></IconTrash>
          </Button>
        </Flex>
      ))}

      <Button
        size="xs"
        color="gray"
        variant="light"
        leftSection={<IconPlus size={14} />}
        onClick={() => {
          form.insertListItem("rules", {
            type: ruleTypes[0],
            value: "",
          });
        }}
      >
        Add Rule
      </Button>
    </Stack>
  );
}

export default LabelEditFormRules;
