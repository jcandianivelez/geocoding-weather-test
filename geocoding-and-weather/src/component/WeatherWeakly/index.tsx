import { Card, Col, Row } from "react-bootstrap";
import { WeatherDay } from "../../App";

interface getWeatherWeaklyProps {
  refCurrentAddress: { current: string };
  weatherWekly: Array<WeatherDay[]> | null;
}

export default function WeatherWekly({
  refCurrentAddress,
  weatherWekly,
}: getWeatherWeaklyProps) {
  return (
    <>
      <h3>{refCurrentAddress.current}</h3>
      <Row gap={3}>
        {weatherWekly?.map((weatherDays: WeatherDay[]) => (
          <Col key={weatherDays[0].number} md={4} className="mb-4">
            <Card className="text-center">
              <Card.Header>{weatherDays[0].name}</Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12} className="mb-3">
                    <Card.Title>{weatherDays[0].name}</Card.Title>

                    <Card.Subtitle>
                      {weatherDays[0].shortForecast}
                    </Card.Subtitle>

                    <Card.Text>
                      <img
                        src={weatherDays[0].icon}
                        alt={weatherDays[0].shortForecast}
                      />
                    </Card.Text>
                    <Card.Text>
                      <strong>Temperature:</strong> {weatherDays[0].temperature}{" "}
                      {weatherDays[0].temperatureUnit}
                    </Card.Text>
                    <Card.Text>
                      <strong>Wind:</strong> {weatherDays[0].windSpeed}{" "}
                      {weatherDays[0].windDirection}
                    </Card.Text>
                    <Card.Text>
                      <strong>Probability of Precipitation:</strong>{" "}
                      {weatherDays[0].probabilityOfPrecipitation.value ?? "0 "}%
                    </Card.Text>
                  </Col>

                  <hr />

                  <Col>
                    <Card.Title>{weatherDays[1].name}</Card.Title>

                    <Card.Subtitle>
                      {weatherDays[1].shortForecast}
                    </Card.Subtitle>
                    <Card.Text>
                      <img
                        src={weatherDays[1].icon}
                        alt={weatherDays[1].shortForecast}
                      />
                    </Card.Text>
                    <Card.Text>
                      <strong>Temperature:</strong> {weatherDays[1].temperature}{" "}
                      {weatherDays[1].temperatureUnit}
                    </Card.Text>
                    <Card.Text>
                      <strong>Wind:</strong> {weatherDays[1].windSpeed}{" "}
                      {weatherDays[1].windDirection}
                    </Card.Text>
                    <Card.Text>
                      <strong>Probability of Precipitation:</strong>{" "}
                      {weatherDays[1].probabilityOfPrecipitation.value ?? "0 "}%
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
}
