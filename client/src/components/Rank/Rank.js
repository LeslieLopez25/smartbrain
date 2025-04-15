export default function Rank({ name, entries }) {
  console.log("Rank Component Props:", { name, entries });

  return (
    <div>
      <p className="white f3">{`${name}, your current entry count is...`}</p>
      <p className="white f1">{entries ?? "0"}</p>{" "}
      {/* Fallback to 0 if undefined */}
    </div>
  );
}
