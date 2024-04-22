import { FormEvent, useEffect, useState } from "react";
import { Benchmark } from "../types/geocoding.types";
import axios from "axios";

function useGeocoding() {
  const [currentBenchmark, setCurrentBenchmark] = useState<Benchmark | null>(
    null
  );
  const [benchmarks, setBenchsmarks] = useState<Benchmark[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/geocode/benchmarks")
      .then(({ data }) => {
        setBenchsmarks(data.benchmarks);
        setCurrentBenchmark(data.benchmarks[0]);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleSelectBenchmark = (event: FormEvent<HTMLSelectElement>): void => {
    const selectedBenchmark = benchmarks.find(
      (benchmark) => benchmark.id === event.currentTarget.value
    );

    if (selectedBenchmark) {
      setCurrentBenchmark(selectedBenchmark);
    }
  };

  return { benchmarks, currentBenchmark, handleSelectBenchmark };
}

export default useGeocoding;
