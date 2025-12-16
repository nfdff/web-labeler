import { Label } from "@/options/types";

export class EnvIcon {
  private element: HTMLLinkElement | HTMLImageElement | null = null;
  private originalElements: HTMLLinkElement[] | null = null;
  private originalUrl: string | null = null;
  private fallbackUrl = "/favicon.ico";
  private emptyUrl =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  private size = 32;
  private reset: () => void = () => {};
  private singleElementMode: boolean = false;
  private baseImage: ImageData | null = null;

  public bindIconElement(element: HTMLLinkElement | HTMLImageElement) {
    this.element = element;
    this.originalUrl = this.getElementUrl(element);
    this.singleElementMode = true;
  }

  public update = (label: Label | null) => {
    this.reset();
    if (!label || label.iconStyle === "none") {
      this.restore();
    } else {
      this.backup();
      this.render(label);
    }
  };

  public restore = () => {
    if (this.singleElementMode && this.element && this.originalUrl) {
      this.setElementUrl(this.element, this.originalUrl);
    }

    if (!this.singleElementMode) {
      if (this.element) {
        this.setElementUrl(this.element, this.emptyUrl);
        this.element.remove();
        this.element = null;
      }
      this.originalElements?.forEach((link) => document.head.appendChild(link));
      this.originalElements = null;
    }
    this.baseImage = null;
  };

  public backup = () => {
    if (!this.singleElementMode && this.originalElements === null) {
      const links = document.querySelectorAll<HTMLLinkElement>(
        'link[rel*="icon"], link[rel="manifest"]',
      );
      this.originalElements = Array.from(links).map(
        (link) => link.cloneNode(true) as HTMLLinkElement,
      );
      links.forEach((link) => link.remove());
    }
  };

  public render = async (label: Label) => {
    const canvas = document.createElement("canvas");
    canvas.width = this.size;
    canvas.height = this.size;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    try {
      if (!this.baseImage) {
        await this.drawBase(ctx);
        this.baseImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } else {
        ctx.putImageData(this.baseImage, 0, 0);
      }

      this.drawLabel(ctx, label);
      this.applyToElement(canvas.toDataURL());
    } catch (e) {
      this.reset = () => {};
    }
  };

  private drawBase(ctx: CanvasRenderingContext2D) {
    return new Promise<void>((resolve, reject) => {
      this.reset = reject;
      const img = new Image();
      img.crossOrigin = "anonymous";

      img.onload = () => {
        ctx.drawImage(img, 0, 0, this.size, this.size);
        this.reset = () => {};
        resolve();
      };
      img.onerror = () => {
        if (img.src === this.fallbackUrl) {
          ctx.fillStyle = "transparent";
          ctx.fillRect(0, 0, this.size, this.size);
          this.reset = () => {};
          resolve();
        } else {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            ctx.drawImage(img, 0, 0, this.size, this.size);
            this.reset = () => {};
            resolve();
          };
          img.onerror = () => {
            ctx.fillStyle = "transparent";
            ctx.fillRect(0, 0, this.size, this.size);
            this.reset = () => {};
            resolve();
          };
          img.src = this.fallbackUrl;
        }
      };
      img.src =
        this.originalUrl ??
        this.originalElements?.find((link) => link.rel.includes("icon"))
          ?.href ??
        this.fallbackUrl;
    });
  }

  drawLabel(ctx: CanvasRenderingContext2D, label: Label) {
    switch (label.shape) {
      case "triangle":
        this.drawLabelTriangle(ctx, label);
        break;
      case "ribbon":
        this.drawLabelRibbon(ctx, label);
        break;
      case "banner":
        this.drawLabelBanner(ctx, label);
        break;
      case "frame":
        this.drawLabelFrame(ctx, label);
        break;
    }
  }

  drawLabelTriangle(ctx: CanvasRenderingContext2D, label: Label) {
    ctx.fillStyle = label.bgColor;
    ctx.beginPath();
    const scale = 0.7;

    switch (label.position) {
      case "left-top":
        ctx.moveTo(0, 0);
        ctx.lineTo(scale * this.size, 0);
        ctx.lineTo(0, scale * this.size);
        break;
      case "right-top":
        ctx.moveTo(this.size, 0);
        ctx.lineTo((1 - scale) * this.size, 0);
        ctx.lineTo(this.size, scale * this.size);
        break;
      case "right-bottom":
        ctx.moveTo(this.size, this.size);
        ctx.lineTo((1 - scale) * this.size, this.size);
        ctx.lineTo(this.size, (1 - scale) * this.size);
        break;
      case "left-bottom":
        ctx.moveTo(0, this.size);
        ctx.lineTo(scale * this.size, this.size);
        ctx.lineTo(0, (1 - scale) * this.size);
        break;
    }

    ctx.closePath();
    ctx.fill();
  }

  drawLabelRibbon(ctx: CanvasRenderingContext2D, label: Label) {
    ctx.strokeStyle = label.bgColor;
    ctx.lineWidth = 0.3 * this.size;
    const scale = 0.7;
    ctx.beginPath();

    switch (label.position) {
      case "left-top":
        ctx.moveTo(0, this.size * scale);
        ctx.lineTo(this.size * scale, 0);
        break;
      case "right-top":
        ctx.moveTo(this.size * (1 - scale), 0);
        ctx.lineTo(this.size, this.size * scale);
        break;
      case "right-bottom":
        ctx.moveTo(this.size, this.size * (1 - scale));
        ctx.lineTo(this.size * (1 - scale), this.size);
        break;
      case "left-bottom":
        ctx.moveTo(0, this.size * (1 - scale));
        ctx.lineTo(this.size * scale, this.size);
        break;
    }

    ctx.stroke();
  }

  drawLabelBanner(ctx: CanvasRenderingContext2D, label: Label) {
    ctx.strokeStyle = label.bgColor;
    const lineWidth = 0.3 * this.size;
    ctx.lineWidth = lineWidth;

    ctx.beginPath();

    switch (label.position) {
      case "left-top":
        ctx.moveTo(0, lineWidth / 2);
        ctx.lineTo(this.size, lineWidth / 2);
        break;
      case "right-top":
        ctx.moveTo(this.size - lineWidth / 2, 0);
        ctx.lineTo(this.size - lineWidth / 2, this.size);
        break;
      case "right-bottom":
        ctx.moveTo(this.size, this.size - lineWidth / 2);
        ctx.lineTo(0, this.size - lineWidth / 2);
        break;
      case "left-bottom":
        ctx.moveTo(lineWidth / 2, 0);
        ctx.lineTo(lineWidth / 2, this.size);
        break;
    }

    ctx.stroke();
  }

  drawLabelFrame(ctx: CanvasRenderingContext2D, label: Label) {
    ctx.strokeStyle = label.bgColor;

    const lineWidth = 0.1 * this.size;
    ctx.lineWidth = lineWidth;

    ctx.strokeRect(
      lineWidth / 2,
      lineWidth / 2,
      this.size - lineWidth,
      this.size - lineWidth,
    );

    ctx.stroke();
  }

  getElementUrl(el: HTMLLinkElement | HTMLImageElement) {
    return el instanceof HTMLLinkElement ? el.href : el.src;
  }

  setElementUrl(el: HTMLLinkElement | HTMLImageElement, value: string) {
    if (el instanceof HTMLLinkElement) {
      el.href = value;
    } else {
      el.src = value;
    }
  }

  applyToElement(url: string) {
    if (!this.element) {
      const linkElement = document.createElement("link");
      linkElement.id = "webLabelerFavicon";
      linkElement.rel = "icon";
      linkElement.href = url;
      const head = document.head || document.getElementsByTagName("head")[0];
      this.element = head.appendChild(linkElement);
    } else {
      this.setElementUrl(this.element, url);
    }
  }
}
