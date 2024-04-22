import { ChangeEvent, SyntheticEvent, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

interface MultiFieldFormProps {
  getCoordinates: (address: string) => void;
}

interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

const defaultAddress: Address = {
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

export default function MultiFieldForm({
  getCoordinates,
}: MultiFieldFormProps) {
  const [address, setAddress] = useState<Address>(defaultAddress);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setAddress({
      ...address,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    const fullAddress = `${address.address}, ${address.city}, ${address.state}, ${address.zipCode}`;

    if (!fullAddress || !address.address) {
      return;
    }

    getCoordinates(fullAddress);

    setAddress(defaultAddress);
  };

  return (
    <Row>
      <Col>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Control
                type="text"
                name="address"
                placeholder="Address (1600 Pennsylvania Avenue NW)"
                onChange={handleChange}
                required
              />
            </Col>

            <Col>
              <Form.Control
                type="text"
                name="city"
                placeholder="City (Washington)"
                onChange={handleChange}
              />
            </Col>

            <Col>
              <Form.Control
                type="text"
                name="state"
                placeholder="State (DC)"
                onChange={handleChange}
              />
            </Col>

            <Col>
              <Form.Control
                type="text"
                name="zipCode"
                placeholder="Zip Code (20500)"
                onChange={handleChange}
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
