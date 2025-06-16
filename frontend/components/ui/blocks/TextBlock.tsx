interface TextBlockProps {
  block: {
    blockType: string;
    value?: string;
  };
}

export default function TextBlock({ block }: TextBlockProps) {
  return (
    <>
      {block.blockType === "TextBlock" && (
        <div className="text-center">{block.value && <p>{block.value}</p>}</div>
      )}
    </>
  );
}
