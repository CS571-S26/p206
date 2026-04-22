import { Row, Col } from "react-bootstrap";
import MatchingTile from "./MatchingTile";

export default function MatchingGrid({
  tiles,
  selectedTiles,
  matchedIds,
  wrongIds,
  onTileClick,
}) {
  return (
    <Row className="g-3 matching-grid">
      {tiles.map((tile) => {
        const isMatched = matchedIds.includes(tile.id);
        const isSelected = selectedTiles.some(
          (selected) => selected.id === tile.id
        );
        const isWrong = wrongIds.includes(tile.id);

        return (
          <Col xs={6} md={4} lg={3} xl={2} key={tile.id}>
            <MatchingTile
              tile={tile}
              isMatched={isMatched}
              isSelected={isSelected}
              isWrong={isWrong}
              onClick={() => onTileClick(tile)}
            />
          </Col>
        );
      })}
    </Row>
  );
}