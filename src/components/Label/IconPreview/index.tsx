import classes from "./style.module.scss";
import photoCircleUrl from "./photo-circle.svg";
import { useComputedColorScheme } from "@mantine/core";
import { useTranslation } from "@/contexts";
import { EnvIcon } from "@/contentScript/EnvIcon";
import { useEffect, useMemo, useRef } from "react";
import { IconPreviewProps } from "./types";

function IconPreview({ label }: IconPreviewProps) {
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: false,
  });
  const { t } = useTranslation();
  const iconRef = useRef<HTMLImageElement>(null);

  const envIcon = useMemo(() => {
    return new EnvIcon();
  }, []);

  const photoCircleThemedUrl = photoCircleUrl.replace(
    "currentColor",
    encodeURIComponent(computedColorScheme === "dark" ? "#e2e2e2" : "#1f1f1f"),
  );

  useEffect(() => {
    if (iconRef.current) {
      envIcon.bindIconElement(iconRef.current);
    }
    return () => {
      envIcon.restore();
    };
  }, [envIcon, photoCircleThemedUrl]);

  useEffect(() => {
    envIcon.update({ ...label, id: "preview", isActive: true });
  }, [envIcon, label]);

  return (
    <div className={classes.iconPreview}>
      <div className={classes.tabbar}>
        <div className={classes.tab}>
          <div className={classes.favicon}>
            <img src={photoCircleThemedUrl} alt="Tab Favicon" ref={iconRef} />
          </div>
          <div className={classes.title}>{t("label_preview_yourTab")}</div>
        </div>
      </div>
    </div>
  );
}

export default IconPreview;
