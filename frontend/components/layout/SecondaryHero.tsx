// props: card title, image

interface SecondaryHeroProps {
  title: string;
  image: string;
  breadcrumbs?: string;
}

export default function SecondaryHero({
  title,
  image,
  breadcrumbs,
}: SecondaryHeroProps) {
  return (
    <div
      className="h-[400px] bg-cover bg-center"
      style={{
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="flex items-center justify-center h-full text-white bg-black bg-opacity-50 p-4 rounded-lg">
        <div className="text-center space-y-2 max-w-[1128px]">
          <div className="text-5xl font-bold font-sans">{title}</div>
          <div>{breadcrumbs}</div>
        </div>
      </div>
    </div>
  );
}
