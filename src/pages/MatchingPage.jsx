import { useMemo, useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { studySets } from "../data/studySets";
import { matchingTerms } from "../data/matchingTerms";
import CardGrid from "../components/CardGrid";
import "./MatchingPage.css";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildBoard(data) {
  const selected25 = shuffle(data).slice(0, 25);

  const terms = selected25.map((item, index) => ({
    id: `term-${index}`,
    text: item.term,
    pairId: index,
    type: "term",
  }));

  const definitions = selected25.map((item, index) => ({
    id: `answer-${index}`,
    text: item.answer,
    pairId: index,
    type: "answer",
  }));

  return shuffle([...terms, ...definitions]);
}

export default function MatchingPage() {
  const { setId } = useParams();

  const selectedSet = useMemo(() => {
    if (!setId) return { id: "default", title: "Matching Game" };
    return studySets.find((set) => set.id === setId);
  }, [setId]);

  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    resetGame();
  }, [setId]);

  function resetGame() {
    setTiles(buildBoard(matchingTerms));
    setSelectedTiles([]);
    setMatchedIds([]);
    setWrongIds([]);
    setIsChecking(false);
  }

  function handleTileClick(tile) {
    if (isChecking) return;
    if (matchedIds.includes(tile.id)) return;
    if (selectedTiles.some((selected) => selected.id === tile.id)) return;

    if (selectedTiles.length === 0) {
      setSelectedTiles([tile]);
      return;
    }

    if (selectedTiles.length === 1) {
      const firstTile = selectedTiles[0];
      const secondTile = tile;

      setSelectedTiles([firstTile, secondTile]);
      setIsChecking(true);

      const isMatch =
        firstTile.pairId === secondTile.pairId &&
        firstTile.type !== secondTile.type;

      if (isMatch) {
        setTimeout(() => {
          setMatchedIds((prev) => [...prev, firstTile.id, secondTile.id]);
          setSelectedTiles([]);
          setIsChecking(false);
        }, 250);
      } else {
        setWrongIds([firstTile.id, secondTile.id]);
        setTimeout(() => {
          setWrongIds([]);
          setSelectedTiles([]);
          setIsChecking(false);
        }, 650);
      }
    }
  }

  const matchCount = matchedIds.length / 2;
  const isComplete = matchCount === 25;

  if (setId && !selectedSet) {
    return (
      <Container className="py-5">
        <h2>Set not found.</h2>
      </Container>
    );
  }

  return (
    <div className="matching-page">
      <Container className="py-5">
        <div className="matching-header">
          <h2 className="matching-title">
            {selectedSet?.title || "Matching Game"}
          </h2>
          <p className="matching-subtitle">
            Match each term with its correct definition. 25 pairs are randomly
            chosen each round.
          </p>

          <div className="matching-stats">
            <span>{matchCount} / 25 matched</span>
          </div>
        </div>

        <CardGrid
        items={tiles}
        getKey={(tile) => tile.id}
        renderText={(tile) => tile.text}
        onItemClick={handleTileClick}
        selectedIds={selectedTiles.map((tile) => tile.id)}
        matchedIds={matchedIds}
        wrongIds={wrongIds}
        colProps={{ xs: 6, md: 4, lg: 3, xl: 2 }}
        cardClassName="matching-card"
        />

        {isComplete && (
          <div className="matching-complete">
            <h2>Nice work — you matched all 25 pairs.</h2>
            <Button className="matching-btn mt-3" onClick={resetGame}>
              Play Again
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}