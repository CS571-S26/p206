import { Button } from "react-bootstrap";

export default function MatchingTile({
  tile,
  isMatched,
  isSelected,
  isWrong,
  onClick,
}) {
  const className = [
    "matching-card",
    isSelected ? "selected" : "",
    isWrong ? "wrong" : "",
    isMatched ? "matched" : "",
  ]
    .join(" ")
    .trim();

  return (
    <Button className={className} onClick={onClick} disabled={isMatched}>
      {!isMatched && tile.text}
    </Button>
  );
}