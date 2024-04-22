import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import OnelineAddressForm from "./component/OnelineAddressForm";
import MultiFieldForm from "./component/MultiFieldForm";
import useGeocoding from "./hooks/useGeocoding.hook";
import axios from "axios";
import WeatherWekly from "./component/WeatherWeakly";

enum FormTypes {
  OneLineAddress = "Onelineaddress",
  MultiFieldAddress = "Multifieldaddres",
  // BatchAddress = "Batchaddress",
}

interface Coordinates {
  y: number;
  x: number;
}

export interface WeatherDay {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend: number | string | null;
  probabilityOfPrecipitation: {
    unitCode: string;
    value: number | string | null;
  };
  dewpoint: { unitCode: string; value: number | string | null };
  relativeHumidity: { unitCode: string; value: number | string | null };
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
}

function App() {
  const refCurrentAddress = useRef<string>("");
  const { benchmarks, currentBenchmark, handleSelectBenchmark } =
    useGeocoding();

  const [formAddressType, setFormAddressType] = useState<FormTypes>(
    FormTypes.OneLineAddress
  );

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);

  const [weatherWekly, setWeatherWeakly] = useState<Array<WeatherDay[]> | null>(
    null
  );

  useEffect(() => {
    if (coordinates) {
      getWeatherWeakly();
    }
  }, [coordinates]);

  const handleChangeFormAddress = (
    event: FormEvent<HTMLSelectElement>
  ): void => {
    setFormAddressType(event.currentTarget.value as FormTypes);
  };

  const getFormAddress = (): ReactNode => {
    const formAddressTypeMap = {
      [FormTypes.OneLineAddress]: (
        <OnelineAddressForm getCoordinates={getCoordinates} />
      ),
      [FormTypes.MultiFieldAddress]: (
        <MultiFieldForm getCoordinates={getCoordinates} />
      ),
      // [FormTypes.BatchAddress]: <div>Batch Address</div>,
    };

    const formAddress = formAddressTypeMap[formAddressType];

    return formAddress;
  };

  const getCoordinates = async (address: string) => {
    try {
      setCoordinates(null);
      setWeatherWeakly(null);

      refCurrentAddress.current = address;
      const splitAddress = address.split(",");

      const addressQuery = splitAddress.map((addressPart) =>
        addressPart.trim().replace(" ", "+")
      );

      const addressQueryStr = addressQuery.join(", ");

      const request = await axios.get(
        `http://localhost:3000/geocode/coordinates?address=${addressQueryStr}&benchmark=${currentBenchmark?.id}`
      );

      if (request.data.coordinates) {
        setCoordinates(request.data.coordinates);
      } else {
        setCoordinates(null);
      }
    } catch (error) {
      console.error(error);
      alert("Error getting coordinates. Please try again.");
    }
  };

  const getWeatherWeakly = async () => {
    if (!coordinates) {
      return;
    }

    const request = await axios.get(
      `http://localhost:3000/weather/forecastWeakly?latitude=${coordinates.y}&longitude=${coordinates.x}`
    );

    if (request.data) {
      setWeatherWeakly(request.data);
    } else {
      setWeatherWeakly(null);
    }
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col>
          <h1 className="text-center">Geocoding and Weather App</h1>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Select Form Address</Form.Label>
          <Form.Select onChange={handleChangeFormAddress}>
            <option value={FormTypes.OneLineAddress}>
              {FormTypes.OneLineAddress}
            </option>
            <option value={FormTypes.MultiFieldAddress}>
              {FormTypes.MultiFieldAddress}
            </option>
            {/* <option value={FormTypes.BatchAddress}>
              {FormTypes.BatchAddress}
            </option> */}
          </Form.Select>
        </Col>

        {benchmarks?.length > 0 && (
          <Col md={4}>
            <Form.Label>Select Benchmark</Form.Label>
            <Form.Select onChange={handleSelectBenchmark}>
              {benchmarks.map(({ id, benchmarkName }) => (
                <option key={id} value={id}>
                  {benchmarkName}
                </option>
              ))}
            </Form.Select>
          </Col>
        )}
      </Row>

      {getFormAddress() as ReactNode}

      <hr />

      {coordinates && (
        <WeatherWekly
          refCurrentAddress={refCurrentAddress}
          weatherWekly={weatherWekly}
        />
      )}
    </Container>
  );
}

export default App;
