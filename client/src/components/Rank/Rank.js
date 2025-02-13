export default function Rank({ name, entries }) {
  return (
    <div>
      <p className="white f3">{`${name}, your current entry count is...`}</p>
      <p className="white f1">{Number(entries) || 0}</p>
    </div>
  );
}
