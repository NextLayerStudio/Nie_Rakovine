"use client";

import { mergeAttributes, Node } from "@tiptap/core";
import type { DOMOutputSpec } from "@tiptap/pm/model";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useState } from "react";

export interface ImageFigureAttrs {
  src: string;
  alt?: string;
  caption?: string;
  credit?: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    imageFigure: {
      /** Insert an image with optional caption + photo-credit fields. */
      setImageFigure: (attrs: ImageFigureAttrs) => ReturnType;
    };
  }
}

function ImageFigureView({ node, updateAttributes, selected }: NodeViewProps) {
  const { src, alt, caption, credit } = node.attrs as ImageFigureAttrs;
  const [localCaption, setLocalCaption] = useState(caption ?? "");
  const [localCredit, setLocalCredit] = useState(credit ?? "");

  return (
    <NodeViewWrapper
      className={`my-5 rounded-lg ${selected ? "ring-2 ring-brand-purple/40" : ""}`}
    >
      <figure className="m-0">
        {src && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt || caption || ""}
            className="w-full rounded-lg object-cover"
            contentEditable={false}
            draggable={false}
          />
        )}
        <figcaption className="mt-2 space-y-1" contentEditable={false}>
          <input
            type="text"
            value={localCaption}
            onChange={(e) => setLocalCaption(e.target.value)}
            onBlur={() => updateAttributes({ caption: localCaption })}
            placeholder="Popis fotky (voliteľné)"
            className="w-full rounded border border-brand-purple/15 bg-white px-2 py-1 text-xs text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-purple/30"
          />
          <input
            type="text"
            value={localCredit}
            onChange={(e) => setLocalCredit(e.target.value)}
            onBlur={() => updateAttributes({ credit: localCredit })}
            placeholder="Zdroj foto (voliteľné)"
            className="w-full rounded border border-brand-purple/15 bg-white px-2 py-1 text-xs text-zinc-500 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-brand-purple/30"
          />
        </figcaption>
      </figure>
    </NodeViewWrapper>
  );
}

/**
 * Image node rendered as <figure><img><figcaption> with an editable caption
 * and photo-credit line. Also parses plain <img> tags (older article bodies)
 * so existing content can be re-opened and captions added retroactively.
 */
export const ImageFigure = Node.create({
  name: "imageFigure",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: "" },
      caption: { default: "" },
      credit: { default: "" },
    };
  },

  parseHTML() {
    return [
      {
        tag: "figure.article-figure",
        getAttrs: (el) => {
          if (typeof el === "string") return false;
          const img = el.querySelector("img");
          const captionEl = el.querySelector(".caption-text");
          const creditEl = el.querySelector(".caption-credit");
          return {
            src: img?.getAttribute("src") ?? null,
            alt: img?.getAttribute("alt") ?? "",
            caption: captionEl?.textContent ?? "",
            credit: (creditEl?.textContent ?? "").replace(/^Zdroj:\s*/, ""),
          };
        },
      },
      {
        tag: "img",
        getAttrs: (el) => {
          if (typeof el === "string") return false;
          return {
            src: el.getAttribute("src"),
            alt: el.getAttribute("alt") ?? "",
            caption: "",
            credit: "",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { src, alt, caption, credit } = node.attrs as ImageFigureAttrs;
    const figcaptionChildren: DOMOutputSpec[] = [];
    if (caption) {
      figcaptionChildren.push(["span", { class: "caption-text" }, caption]);
    }
    if (credit) {
      figcaptionChildren.push([
        "cite",
        { class: "caption-credit" },
        `Zdroj: ${credit}`,
      ]);
    }

    const children: DOMOutputSpec[] = [
      ["img", mergeAttributes(HTMLAttributes, { src, alt: alt || caption || "" })],
    ];
    if (figcaptionChildren.length > 0) {
      children.push(["figcaption", {}, ...figcaptionChildren]);
    }

    return ["figure", { class: "article-figure" }, ...children] as DOMOutputSpec;
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageFigureView);
  },

  addCommands() {
    return {
      setImageFigure:
        (attrs: ImageFigureAttrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
    };
  },
});
