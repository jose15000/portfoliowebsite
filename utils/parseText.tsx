import { msnEmoticons } from "./emoticons";

export const formatTextWithEmoticons = (text: string) => {
    if (!text) return text;

    const emoticonCodes = Object.keys(msnEmoticons).sort((a, b) => b.length - a.length);
    const escapedCodes = emoticonCodes.map((code) =>
      code.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
    );

    const regex = new RegExp(`(${escapedCodes.join("|")})`, "g");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const emoticonUrl = msnEmoticons[part as keyof typeof msnEmoticons];

      if (emoticonUrl) {
        return (
          <img
            key={index}
            src={emoticonUrl}
            alt={part}
            className="inline-block h-[19px] align-middle mx-0.5"
          />
        );
      }

      return part;
    });
  };