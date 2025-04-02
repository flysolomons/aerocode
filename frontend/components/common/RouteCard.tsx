interface RouteCardProps {
  origin: string;
  destination: string;
}

function RouteCard({ origin, destination }: RouteCardProps) {
  return (
    <div className="px-4 py-4 bg-white rounded-2xl shadow">
      <span>
        {origin} to {destination}
      </span>
    </div>
  );
}

export default RouteCard;
