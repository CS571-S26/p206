import { Button } from "react-bootstrap";

export default function CardTile({
  text,
  content,
  isMatched = false,
  isSelected = false,
  isWrong = false,
  className = "app-card",
  onClick,
}) {
  const classes = [
    className,
    isSelected ? "selected" : "",
    isWrong ? "wrong" : "",
    isMatched ? "matched" : "",
  ]
    .join(" ")
    .trim();

  return (
    <Button className={classes} onClick={onClick} disabled={isMatched}>
      {!isMatched && (content || text)}
    </Button>
  );
}