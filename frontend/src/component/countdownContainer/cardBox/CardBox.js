import Card from "react-bootstrap/Card";
import CountdownImage from "../asset/image/thumb.png";

function CardBox() {
  return (
    <Card style={{ width: "20rem" }} className="p-5">
      <Card.Img variant="top" src={CountdownImage} />
      <Card.Body>
        {/* <Card.Title>Card Title</Card.Title> */}
        <Card.Text className="mt-2"> Use Custom Style for this</Card.Text>
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
}

export default CardBox;
