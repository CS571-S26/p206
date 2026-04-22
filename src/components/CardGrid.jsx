import { Row, Col } from "react-bootstrap";
import CardTile from "./CardTile";

export default function CardGrid({
  items,
  getKey,
  renderText,
  renderContent,
  onItemClick,
  selectedIds = [],
  matchedIds = [],
  wrongIds = [],
  colProps = { xs: 12, sm: 6, md: 4, lg: 3, xl: 3 },
  cardClassName = "app-card",
  rowClassName = "g-4",
}) {
  return (
    <Row className={rowClassName}>
      {items.map((item) => {
        const itemId = getKey(item);
        const isMatched = matchedIds.includes(itemId);
        const isSelected = selectedIds.includes(itemId);
        const isWrong = wrongIds.includes(itemId);

        return (
          <Col {...colProps} key={itemId}>
            <CardTile
              text={renderText ? renderText(item) : ""}
              content={renderContent ? renderContent(item) : null}
              isMatched={isMatched}
              isSelected={isSelected}
              isWrong={isWrong}
              className={cardClassName}
              onClick={onItemClick ? () => onItemClick(item) : undefined}
            />
          </Col>
        );
      })}
    </Row>
  );
}