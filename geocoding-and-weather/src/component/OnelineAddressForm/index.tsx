import { SyntheticEvent } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

interface OnelineAddressFormProps {
  getCoordinates: (address: string) => void;
}

export default function OnelineAddressForm({
  getCoordinates,
}: OnelineAddressFormProps) {
  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      address: { value: string };
    };

    const fullAddress = target.address.value.trim() as string;

    if (!fullAddress) {
      target.address.value = "";
      return;
    }

    getCoordinates(fullAddress);

    target.address.value = "";
  };

  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={10}>
              <Form.Control
                type="text"
                name="address"
                placeholder="Enter location (1600 Pennsylvania Avenue NW, Washington, DC, 205000)"
                required
              />
            </Col>
            <Col>
              <Button variant="primary" type="submit">
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
