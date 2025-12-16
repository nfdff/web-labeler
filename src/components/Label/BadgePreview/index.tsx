import { Label } from "@/options/types.ts";
import { useTranslation } from "@/contexts";
import classes from "./style.module.scss";
import clsx from "clsx";
import { Card } from "@mantine/core";
import { nlToBr } from "@/utils/common.ts";
import { ReactNode } from "react";

interface BadgePreviewProps {
  label: Omit<Label, "id" | "isActive">;
  children?: ReactNode;
}

function BadgePreview({ label, children }: BadgePreviewProps) {
  const { t } = useTranslation();

  return (
    <Card padding="lg" radius="sm" withBorder className={classes.badgePreview}>
      <span>{t("label_preview_window")}</span>
      <div
        className={clsx(
          classes.label,
          classes[label.shape],
          classes[label.position],
        )}
        style={
          {
            position: "absolute",
            pointerEvents: "unset",
            zIndex: "unset",
            "--label-text-color": label.textColor,
            "--label-background-color": label.bgColor,
            "--label-opacity": label.opacity,
            "--label-hovered-opacity": label.hoveredOpacity,
            "--label-scale": label.scale,
            "--label-font-size": label.fontSize + "px",
            "--label-border-style": label.border,
            "--label-border-color": label.borderColor,
            "--label-border-width": label.borderWidth + "px",
          } as React.CSSProperties
        }
        dangerouslySetInnerHTML={{
          __html: label.shape !== "frame" ? nlToBr(label.name) : "",
        }}
      ></div>
      {label.shape !== "frame" && children}
    </Card>
  );
}

export default BadgePreview;
