import { useMemo, useState, useEffect } from "react";
import { Container, Button, Card, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { studySets } from "../data/studySets";
import { matchingTerms } from "../data/matchingTerms";
import CardGrid from "../components/CardGrid";
import "./MatchingPage.css";

const MATCHING_LAST_SET_KEY = "lastMatchingSetId";
const MATCHING_PROGRESS_KEY = "matchingProgress";

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
  const navigate = useNavigate();

  const activeMatchingSetId = setId || "default";

  const selectedSet = useMemo(() => {
    if (!setId) {
      return { id: "default", title: "Matching Game" };
    }

    return studySets.find((set) => set.id === setId);
  }, [setId]);

  const [tiles, setTiles] = useState([]);
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!setId) {
      const lastSet = sessionStorage.getItem(MATCHING_LAST_SET_KEY);

      if (lastSet && lastSet !== "default") {
        navigate(`/matching/${lastSet}`);
      }
    }
  }, [setId, navigate]);

  useEffect(() => {
    const savedProgress =
      JSON.parse(sessionStorage.getItem(MATCHING_PROGRESS_KEY)) || {};

    const savedSetProgress = savedProgress[activeMatchingSetId];

    if (savedSetProgress && savedSetProgress.tiles?.length) {
      setTiles(savedSetProgress.tiles);
      setMatchedIds(savedSetProgress.matchedIds || []);
      setSelectedTiles([]);
      setWrongIds([]);
      setIsChecking(false);
    } else {
      resetGame(false);
    }

    sessionStorage.setItem(MATCHING_LAST_SET_KEY, activeMatchingSetId);
  }, [activeMatchingSetId]);

  useEffect(() => {
    if (tiles.length === 0) return;

    const savedProgress =
      JSON.parse(sessionStorage.getItem(MATCHING_PROGRESS_KEY)) || {};

    savedProgress[activeMatchingSetId] = {
      tiles,
      matchedIds,
    };

    sessionStorage.setItem(
      MATCHING_PROGRESS_KEY,
      JSON.stringify(savedProgress)
    );

    sessionStorage.setItem(MATCHING_LAST_SET_KEY, activeMatchingSetId);
  }, [tiles, matchedIds, activeMatchingSetId]);

  function resetGame(clearSavedProgress = true) {
    const newTiles = buildBoard(matchingTerms);

    setTiles(newTiles);
    setSelectedTiles([]);
    setMatchedIds([]);
    setWrongIds([]);
    setIsChecking(false);

    if (clearSavedProgress) {
      const savedProgress =
        JSON.parse(sessionStorage.getItem(MATCHING_PROGRESS_KEY)) || {};

      delete savedProgress[activeMatchingSetId];

      sessionStorage.setItem(
        MATCHING_PROGRESS_KEY,
        JSON.stringify(savedProgress)
      );
    }
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
  const totalPairs = 25;
  const isComplete = matchCount === totalPairs;

  if (setId && !selectedSet) {
    return (
      <div className="matching-page">
        <Container className="py-5">
          <Card className="matching-info-card border-0">
            <Card.Body className="text-center">
              <h1 className="matching-title">Set not found</h1>
              <p className="matching-subtitle">
                This matching set does not exist.
              </p>
              <Button className="matching-btn" onClick={() => navigate("/matching")}>
                Back to Matching
              </Button>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div className="matching-page">
      <Container className="py-5">
        <Card className="matching-info-card border-0 mb-4">
          <Card.Body className="matching-header">
            <Badge className="matching-badge mb-3">Security+ Practice</Badge>

            <h1 className="matching-title">
              {selectedSet?.title || "Matching Game"}
            </h1>

            <p className="matching-subtitle">
              Match each term with its correct definition. 25 pairs are randomly
              chosen each round.
            </p>

            <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
              <div className="matching-stats">
                <span>
                  {matchCount} / {totalPairs} matched
                </span>
              </div>

              <Button className="matching-btn" onClick={() => resetGame(true)}>
                Restart Game
              </Button>
            </div>
          </Card.Body>
        </Card>

        <Card className="matching-board-card border-0">
          <Card.Body>
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
          </Card.Body>
        </Card>

        {isComplete && (
          <Card className="matching-complete border-0 mt-4">
            <Card.Body className="text-center">
              <h2>Nice work — you matched all 25 pairs.</h2>
              <p className="matching-subtitle mb-0">
                You completed the full matching round.
              </p>

              <Button className="matching-btn mt-3" onClick={() => resetGame(true)}>
                Play Again
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}