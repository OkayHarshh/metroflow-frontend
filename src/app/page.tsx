"use client";

import { useEffect, useState } from "react";

type StationCrowd = {
  station_id: string;
  station_name: string;
  hour: number;
  scheduled_train_visits: number;
  activity_level: string;
  crowd_score: number;
  crowd_level: string;
  estimated_seat_likelihood_pct: number;
};

type StationDetail = {
  station_id: string;
  station_name: string;
  line: string | null;
  is_interchange: boolean;
  from_line: string | null;
  to_line: string | null;
};

type CrowdSummary = {
  average_crowd_score: number | null;
  average_estimated_seat_likelihood_pct: number | null;
  worst_estimated_seat_likelihood_pct: number | null;
  worst_station_name: string | null;
  maximum_crowd_score: number | null;
};

type Route = {
  type: string;
  travel_time_minutes: number;
  interchange_count: number;
  lines_used: string[];
  stations: string[];
  station_details: StationDetail[];
  crowd_summary: CrowdSummary;
  station_crowd: StationCrowd[];
  route_score: number;
};

type PlanResponse = {
  source: string;
  destination: string;
  departure_time: string;
  crowd_profile_hour: number;
  routes: Route[];
  route_count: number;
  disclaimer: string;
};

const LINE_COLORS: Record<string, string> = {
  RED: "#E84C4C",
  YELLOW: "#E5B93F",
  BLUE: "#4D82D9",
  GREEN: "#4DA878",
  PINK: "#D9679B",
  MAGENTA: "#B65BD4",
  VIOLET: "#7667C9",
  ORANGE: "#E98A45",
  GRAY: "#8B929C",
  RAPID: "#43AFC2",
  AIRPORT: "#43AFC2",
};

function getLineColor(line: string | null) {
  if (!line) return "#7C8490";
  return LINE_COLORS[line.toUpperCase()] || "#7C8490";
}

function getCrowdColor(score: number) {
  if (score < 25) return "#4DA878";
  if (score < 50) return "#D6AE45";
  if (score < 75) return "#E98A45";
  return "#E85A5A";
}

function getBadge(type: string) {
  if (type === "FASTEST") {
    return {
      text: "Fastest",
      icon: "⚡",
      className: "badge-fast",
    };
  }

  if (type === "COMFORTABLE") {
    return {
      text: "Comfortable",
      icon: "☁",
      className: "badge-comfort",
    };
  }

  if (type === "BALANCED") {
    return {
      text: "Balanced",
      icon: "◐",
      className: "badge-balanced",
    };
  }

  return {
    text: "Alternative",
    icon: "↗",
    className: "badge-default",
  };
}


/* ============================================================
   CARTOON TRAIN
============================================================ */

function AnimatedTrain() {
  return (
    <div className="train-scene">

      <div className="city city-one" />
      <div className="city city-two" />
      <div className="city city-three" />
      <div className="city city-four" />

      <div className="track-glow" />

      <div className="rail rail-one" />
      <div className="rail rail-two" />

      <div className="train">

        <div className="train-front">

          <div className="train-window">
            <div className="driver-dot" />
          </div>

          <div className="train-light" />

        </div>

        <div className="train-body">

          <div className="train-logo">
            MF
          </div>

          <div className="train-window-small" />
          <div className="train-window-small" />
          <div className="train-window-small" />

        </div>

        <div className="train-wheel wheel-one" />
        <div className="train-wheel wheel-two" />

      </div>

      <div className="track-station station-a" />
      <div className="track-station station-b" />
      <div className="track-station station-c" />

    </div>
  );
}


/* ============================================================
   METRO ROUTE
============================================================ */

function MetroRoute({ route }: { route: Route }) {

  const stations = route.station_details || [];

  return (
    <div className="route-map">

      <div className="route-map-heading">

        <div>
          <span className="eyebrow">
            YOUR RIDE
          </span>

          <h4>
            Route map
          </h4>
        </div>

        <div className="line-pills">

          {route.lines_used.map((line) => (
            <span
              key={line}
              className="line-pill"
            >
              <span
                className="line-dot"
                style={{
                  background: getLineColor(line),
                }}
              />
              {line}
            </span>
          ))}

        </div>

      </div>


      <div className="route-scroll">

        <div className="metro-path">

          {stations.map((station, index) => {

            const first = index === 0;
            const last =
              index === stations.length - 1;

            const lineColor =
              getLineColor(station.line);

            return (
              <div
                className="metro-stop"
                key={`${station.station_id}-${index}`}
              >

                {!last && (
                  <div
                    className="metro-segment"
                    style={{
                      background: lineColor,
                    }}
                  />
                )}

                <div className="metro-node-wrap">

                  {station.is_interchange ? (

                    <div
                      className="interchange-node"
                      style={{
                        borderColor:
                          getLineColor(
                            station.to_line
                          ),
                      }}
                    >

                      <span
                        style={{
                          background:
                            getLineColor(
                              station.from_line
                            ),
                        }}
                      />

                      <b
                        style={{
                          background:
                            getLineColor(
                              station.to_line
                            ),
                        }}
                      />

                    </div>

                  ) : (

                    <div
                      className={`normal-node ${
                        first || last
                          ? "terminal-node"
                          : ""
                      }`}
                      style={{
                        background: lineColor,
                      }}
                    />

                  )}

                </div>


                <div
                  className={`station-label ${
                    first || last
                      ? "terminal-label"
                      : ""
                  }`}
                >

                  <span>
                    {station.station_name}
                  </span>

                  {first && (
                    <small>
                      START
                    </small>
                  )}

                  {last && (
                    <small>
                      DESTINATION
                    </small>
                  )}

                  {station.is_interchange && (
                    <div className="change-label">

                      <span>
                        CHANGE
                      </span>

                      <b
                        style={{
                          color:
                            getLineColor(
                              station.from_line
                            ),
                        }}
                      >
                        {station.from_line}
                      </b>

                      <i>→</i>

                      <b
                        style={{
                          color:
                            getLineColor(
                              station.to_line
                            ),
                        }}
                      >
                        {station.to_line}
                      </b>

                    </div>
                  )}

                </div>

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}


/* ============================================================
   MAIN
============================================================ */

export default function Home() {

  const [source, setSource] =
    useState("Rithala");

  const [destination, setDestination] =
    useState("Rajiv Chowk");

  const [stations, setStations] =
    useState<string[]>([]);

  const [sourceSuggestions, setSourceSuggestions] =
    useState<string[]>([]);

  const [destinationSuggestions, setDestinationSuggestions] =
    useState<string[]>([]);

  const [sourceFocused, setSourceFocused] =
    useState(false);

  const [destinationFocused, setDestinationFocused] =
    useState(false);

  const [departureTime, setDepartureTime] =
    useState("18:35");

  const [result, setResult] =
    useState<PlanResponse | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [nightMode, setNightMode] =
    useState(false);

  useEffect(() => {
    async function loadStations() {
      try {
        const response = await fetch(
          "https://metroflow-backend-53w8.onrender.com/stations"
        );

        if (!response.ok) {
          throw new Error("Could not load stations");
        }

        const data = await response.json();
        setStations(data.stations || []);
      } catch (error) {
        console.error("Station loading error:", error);
      }
    }

    loadStations();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("metroflow-theme");
    if (savedTheme === "night") {
      setNightMode(true);
    }
  }, []);

  function toggleTheme() {
    setNightMode((current) => {
      const next = !current;
      localStorage.setItem(
        "metroflow-theme",
        next ? "night" : "day"
      );
      return next;
    });
  }


  function getSuggestions(value: string): string[] {
    const query = value.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const startsWith = stations.filter((station) =>
      station.toLowerCase().startsWith(query)
    );

    const contains = stations.filter(
      (station) =>
        !station.toLowerCase().startsWith(query) &&
        station.toLowerCase().includes(query)
    );

    return [...startsWith, ...contains].slice(0, 8);
  }

//  YE YAHAN PASTE KARO
function formatTime12Hour(time: string): string {
  const [hourString, minute] = time.split(":");
  const hour = Number(hourString);

  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  return `${hour12}:${minute} ${period}`;
}


 async function planJourney() {

  setLoading(true);
  setError("");
  setResult(null);

  try {

    // MetroFlow service-hours check
    const [hourString, minuteString] =
      departureTime.split(":");

    const hour = Number(hourString);
    const minute = Number(minuteString);

    const totalMinutes =
      hour * 60 + minute;

    // Metro unavailable from 12:00 AM to 5:45 AM
    if (
      totalMinutes >= 0 &&
      totalMinutes < 5 * 60 + 45
    ) {
      setError(
        "Metro service is unavailable between 12:00 AM and 5:45 AM."
      );

      setLoading(false);
      return;
    }

    // Existing API call starts here

      const url =
        `https://metroflow-backend-53w8.onrender.com/plan` +
        `?source=${encodeURIComponent(source)}` +
        `&destination=${encodeURIComponent(destination)}` +
        `&departure_time=${encodeURIComponent(
          departureTime
        )}`;

      const response =
        await fetch(url);

      if (!response.ok) {

        const body =
          await response.json()
            .catch(() => null);

        throw new Error(
          body?.detail ||
          "Could not find this journey."
        );
      }

      const data: PlanResponse =
        await response.json();

      setResult(data);

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <main className={`metro-page ${nightMode ? "night-mode" : ""}`}>

      <style jsx global>{`

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          background: #F4F0E8;
        }

        .metro-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 10% 0%,
              #fffaf0 0%,
              transparent 28%
            ),
            #F4F0E8;
          color: #17202B;
          overflow-x: hidden;
        }

        /* ================================================
           HEADER
        ================================================ */

        .topbar {
          max-width: 1240px;
          margin: auto;
          padding: 24px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-mark {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #17202B;
          color: white;
          display: grid;
          place-items: center;
          font-size: 21px;
          box-shadow:
            4px 5px 0 #D9D2C4;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.6px;
        }

        .brand-sub {
          font-size: 11px;
          color: #89909A;
          margin-top: 1px;
        }

        .live-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          border: 1px solid #E4DED2;
          border-radius: 100px;
          padding: 9px 14px;
          font-size: 11px;
          color: #68717C;
          font-weight: 600;
        }

        .live-dot {
          width: 7px;
          height: 7px;
          background: #54A878;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        /* ================================================
           HERO
        ================================================ */

        .hero {
          max-width: 1240px;
          margin: auto;
          padding: 20px 28px 0;
        }

        .hero-copy {
          max-width: 720px;
        }

        .eyebrow {
          display: inline-block;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
          color: #8C7560;
          margin-bottom: 10px;
        }

        .hero h1 {
          font-size: clamp(42px, 6vw, 76px);
          line-height: 0.96;
          letter-spacing: -4px;
          margin: 0;
          font-weight: 850;
        }

        .hero h1 em {
          font-style: normal;
          color: #E2534F;
        }

        .hero-text {
          margin-top: 20px;
          max-width: 560px;
          font-size: 15px;
          line-height: 1.7;
          color: #707984;
        }

        /* ================================================
           TRAIN SCENE
        ================================================ */

        .train-scene {
          height: 150px;
          margin-top: 18px;
          position: relative;
          overflow: hidden;
          border-bottom: 1px solid #D9D2C5;
        }

        .city {
          position: absolute;
          bottom: 29px;
          width: 70px;
          background: #E5DED2;
          opacity: .7;
        }

        .city::before,
        .city::after {
          content: "";
          position: absolute;
          width: 5px;
          height: 5px;
          background: #C8BFAF;
          box-shadow:
            14px 0 #C8BFAF,
            28px 0 #C8BFAF,
            0 13px #C8BFAF,
            14px 13px #C8BFAF,
            28px 13px #C8BFAF;
        }

        .city::before {
          left: 12px;
          top: 12px;
        }

        .city-one {
          height: 42px;
          left: 4%;
        }

        .city-two {
          height: 68px;
          left: 17%;
        }

        .city-three {
          height: 52px;
          right: 18%;
        }

        .city-four {
          height: 78px;
          right: 4%;
        }

        .rail {
          position: absolute;
          left: -10%;
          width: 120%;
          height: 3px;
          background: #7D858D;
          bottom: 27px;
        }

        .rail-two {
          bottom: 20px;
          opacity: .35;
        }

        .track-glow {
          position: absolute;
          left: -10%;
          width: 120%;
          height: 7px;
          bottom: 25px;
          background: repeating-linear-gradient(
            90deg,
            transparent 0,
            transparent 28px,
            #BDB5A7 29px,
            #BDB5A7 32px
          );
          opacity: .55;
        }

        .train {
          position: absolute;
          width: 210px;
          height: 58px;
          left: -230px;
          bottom: 30px;
          display: flex;
          animation: trainRide 10s linear infinite;
          z-index: 5;
        }

        .train-body {
          height: 50px;
          width: 145px;
          background: #F7F3E9;
          border: 3px solid #17202B;
          border-left: 0;
          border-radius: 0 13px 8px 0;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px;
          position: relative;
        }

        .train-front {
          width: 65px;
          height: 50px;
          background: #E2534F;
          border: 3px solid #17202B;
          border-radius: 16px 0 0 7px;
          position: relative;
          padding: 7px;
        }

        .train-window {
          width: 40px;
          height: 25px;
          border-radius: 7px;
          background: #A9D1D7;
          border: 2px solid #17202B;
          position: relative;
        }

        .driver-dot {
          width: 7px;
          height: 7px;
          background: #17202B;
          border-radius: 50%;
          position: absolute;
          bottom: 3px;
          right: 5px;
        }

        .train-light {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #FFF4C2;
          position: absolute;
          right: -4px;
          top: 33px;
          box-shadow: 0 0 8px #FFF4C2;
        }

        .train-logo {
          width: 25px;
          height: 25px;
          border-radius: 8px;
          background: #17202B;
          color: white;
          display: grid;
          place-items: center;
          font-size: 7px;
          font-weight: 800;
        }

        .train-window-small {
          width: 25px;
          height: 23px;
          background: #A9D1D7;
          border: 2px solid #17202B;
          border-radius: 5px;
        }

        .train-wheel {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #17202B;
          border: 3px solid #F4F0E8;
          bottom: -7px;
        }

        .wheel-one {
          left: 22px;
        }

        .wheel-two {
          right: 30px;
        }

        .track-station {
          position: absolute;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #17202B;
          bottom: 18px;
          z-index: 3;
        }

        .station-a {
          left: 25%;
        }

        .station-b {
          left: 53%;
        }

        .station-c {
          right: 20%;
        }

        /* ================================================
           PLANNER
        ================================================ */

        .planner {
          max-width: 1240px;
          margin: -2px auto 0;
          padding: 0 28px;
          position: relative;
          z-index: 10;
        }

        .planner-card {
          background: #17202B;
          border-radius: 24px;
          padding: 22px;
          box-shadow:
            0 20px 50px rgba(36, 39, 42, .15),
            6px 6px 0 #D9D2C5;
        }

        .planner-title {
          color: white;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          margin-bottom: 15px;
        }

        .planner-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 170px 150px;
          gap: 10px;
        }

        .autocomplete-wrap {
          position: relative;
        }

        .station-suggestions {
          position: absolute;
          top: calc(100% + 7px);
          left: 0;
          right: 0;
          background: #ffffff;
          border: 1px solid #E1DDD4;
          border-radius: 14px;
          padding: 6px;
          box-shadow: 0 18px 40px rgba(20, 25, 30, 0.18);
          z-index: 1000;
          max-height: 280px;
          overflow-y: auto;
        }

        .station-suggestion {
          width: 100%;
          border: 0;
          background: transparent;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 10px;
          border-radius: 10px;
          color: #17202B;
          font-size: 12px;
          font-weight: 650;
          text-align: left;
          cursor: pointer;
          transition: 0.15s;
        }

        .station-suggestion:hover {
          background: #F5F1E9;
        }

        .suggestion-icon {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: grid;
          place-items: center;
          background: #F0ECE3;
          border-radius: 8px;
          font-size: 13px;
        }

        .metro-page.night-mode .station-suggestions {
          background: #202B38;
          border-color: #3A4654;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
        }

        .metro-page.night-mode .station-suggestion {
          color: #F5F7FA;
        }

        .metro-page.night-mode .station-suggestion:hover {
          background: #2B3745;
        }

        .metro-page.night-mode .suggestion-icon {
          background: #303D4C;
        }

        .field label {
          display: block;
          color: #8D98A5;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.3px;
          margin: 0 0 7px 4px;
        }

        .field input {
          width: 100%;
          height: 49px;
          border: 1px solid #343F4B;
          background: #202B38;
          color: white;
          border-radius: 13px;
          padding: 0 14px;
          outline: none;
          font-size: 13px;
          transition: .2s;
        }

        .field input:focus {
          border-color: #E2534F;
          background: #25313F;
        }

        .plan-button {
          height: 49px;
          border: 0;
          border-radius: 13px;
          background: #E2534F;
          color: white;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: .2s;
          box-shadow: 0 4px 0 #B93E3A;
        }

        .plan-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #B93E3A;
        }

        .plan-button:active {
          transform: translateY(2px);
          box-shadow: 0 2px 0 #B93E3A;
        }

        .plan-button:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .error {
          margin-top: 12px;
          color: #FFB1AD;
          font-size: 12px;
        }

        /* ================================================
           RESULTS
        ================================================ */

        .results {
          max-width: 1240px;
          margin: 55px auto;
          padding: 0 28px;
        }

        .results-head {
          display: flex;
          justify-content: space-between;
          align-items: end;
          margin-bottom: 22px;
        }

        .results-title {
          font-size: 31px;
          font-weight: 850;
          letter-spacing: -1.4px;
          margin: 3px 0;
        }

        .results-sub {
          font-size: 12px;
          color: #89909A;
        }

        .route-count {
          background: white;
          border: 1px solid #E1DBD0;
          padding: 9px 13px;
          border-radius: 100px;
          color: #7C8490;
          font-size: 11px;
          font-weight: 700;
        }

        .route-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
        }

        /* ================================================
           ROUTE CARD
        ================================================ */

        .route-card {
          background: #FFFDF8;
          border: 1px solid #E1DBD0;
          border-radius: 24px;
          overflow: hidden;
          transition:
            transform .25s ease,
            box-shadow .25s ease;
          animation: cardIn .5s ease both;
        }

        .route-card:nth-child(2) {
          animation-delay: .08s;
        }

        .route-card:nth-child(3) {
          animation-delay: .16s;
        }

        .route-card:hover {
          transform: translateY(-6px) rotate(-.2deg);
          box-shadow:
            0 18px 35px rgba(50, 49, 45, .11);
        }

        .route-card-top {
          height: 6px;
        }

        .top-fastest {
          background: #4D82D9;
        }

        .top-comfort {
          background: #4DA878;
        }

        .top-balanced {
          background: #7667C9;
        }

        .top-default {
          background: #8B929C;
        }

        .route-content {
          padding: 21px;
        }

        .route-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .route-badge {
          border-radius: 100px;
          padding: 6px 10px;
          font-size: 10px;
          font-weight: 800;
          display: flex;
          gap: 5px;
          align-items: center;
        }

        .badge-fast {
          background: #EAF1FC;
          color: #4776BC;
        }

        .badge-comfort {
          background: #E8F5ED;
          color: #438B63;
        }

        .badge-balanced {
          background: #EEEAF9;
          color: #665AB1;
        }

        .badge-default {
          background: #EEF0F2;
          color: #68717C;
        }

        .option-number {
          color: #A0A5AA;
          font-size: 10px;
          font-weight: 700;
        }

        .big-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
        }

        .metric {
          background: #F5F1E9;
          border-radius: 15px;
          padding: 14px;
        }

        .metric-label {
          color: #969B9F;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .metric-value {
          font-size: 25px;
          line-height: 1;
          font-weight: 850;
          margin-top: 8px;
          letter-spacing: -1px;
        }

        .metric-unit {
          color: #969B9F;
          font-size: 10px;
          font-weight: 600;
          margin-left: 3px;
        }

        .section-label {
          color: #969B9F;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.1px;
          margin: 20px 0 8px;
        }

        .line-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .line-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          background: #F3F0E9;
          border: 1px solid #E4DED3;
          border-radius: 100px;
          color: #626A72;
          font-size: 9px;
          font-weight: 800;
        }

        .line-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .crowd-block {
          margin-top: 18px;
        }

        .crowd-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 7px;
        }

        .crowd-score {
          font-size: 12px;
          font-weight: 850;
        }

        .crowd-track {
          height: 7px;
          background: #E9E5DC;
          border-radius: 100px;
          overflow: hidden;
        }

        .crowd-fill {
          height: 100%;
          border-radius: 100px;
          transition: width .7s ease;
        }

        .seat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 9px;
        }

        .seat-box {
          padding: 12px;
          background: #F8F5EF;
          border-radius: 14px;
          border: 1px solid #E9E4DA;
        }

        .seat-label {
          color: #92989E;
          font-size: 9px;
          font-weight: 700;
        }

        .seat-value {
          margin-top: 5px;
          font-size: 15px;
          font-weight: 850;
        }

        .seat-green {
          color: #448D63;
        }

        .seat-orange {
          color: #D47A3D;
        }

        .worst-station {
          margin-top: 4px;
          font-size: 10px;
          font-weight: 800;
          color: #5D646B;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ================================================
           ROUTE MAP
        ================================================ */

        .route-map {
          margin-top: 20px;
          padding-top: 18px;
          border-top: 1px dashed #DDD6CA;
        }

        .route-map-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 10px;
        }

        .route-map-heading h4 {
          margin: 0;
          font-size: 14px;
          letter-spacing: -.3px;
        }

        .route-scroll {
          margin-top: 13px;
          max-height: 340px;
          overflow-y: auto;
          padding: 8px 4px;
        }

        .metro-path {
          position: relative;
        }

        .metro-stop {
          min-height: 47px;
          position: relative;
          display: flex;
          align-items: flex-start;
        }

        .metro-segment {
          position: absolute;
          left: 9px;
          top: 17px;
          width: 4px;
          height: 47px;
          border-radius: 10px;
          z-index: 1;
        }

        .metro-node-wrap {
          width: 22px;
          min-width: 22px;
          height: 24px;
          position: relative;
          z-index: 4;
          display: grid;
          place-items: center;
        }

        .normal-node {
          width: 10px;
          height: 10px;
          border: 3px solid #FFFDF8;
          border-radius: 50%;
          box-shadow: 0 0 0 1px #CFC8BC;
        }

        .terminal-node {
          width: 16px;
          height: 16px;
          border: 3px solid #FFFDF8;
          box-shadow: 0 0 0 2px currentColor;
        }

        .interchange-node {
          width: 22px;
          height: 22px;
          border: 3px solid;
          background: #FFFDF8;
          border-radius: 50%;
          display: grid;
          place-items: center;
          position: relative;
        }

        .interchange-node span {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .interchange-node b {
          position: absolute;
          width: 7px;
          height: 7px;
          right: -4px;
          top: -4px;
          border: 2px solid #FFFDF8;
          border-radius: 50%;
        }

        .station-label {
          margin-left: 10px;
          margin-top: 2px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          color: #7D848A;
          font-size: 10px;
          line-height: 1.2;
        }

        .terminal-label {
          color: #303941;
          font-weight: 800;
        }

        .station-label small {
          color: #A0A4A8;
          font-size: 7px;
          letter-spacing: 1px;
          font-weight: 800;
        }

        .change-label {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 6px;
          background: #F2EEE6;
          border-radius: 100px;
          font-size: 7px;
          font-weight: 800;
        }

        .change-label span {
          color: #A0A4A8;
          margin-right: 2px;
        }

        .change-label i {
          color: #A0A4A8;
          font-style: normal;
        }

        /* ================================================
           COMPARISON
        ================================================ */

        .comparison {
          margin-top: 28px;
          background: #17202B;
          color: white;
          border-radius: 24px;
          padding: 25px;
          box-shadow: 5px 5px 0 #D0C8BA;
        }

        .comparison-title {
          font-size: 20px;
          font-weight: 850;
          letter-spacing: -.6px;
          margin: 2px 0 17px;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }

        .comparison-item {
          padding: 17px;
          border: 1px solid #303B47;
          border-radius: 16px;
          background: #1E2935;
        }

        .comparison-icon {
          font-size: 19px;
        }

        .comparison-item h4 {
          margin: 9px 0 4px;
          font-size: 13px;
        }

        .comparison-item p {
          margin: 0;
          color: #8D98A5;
          font-size: 10px;
          line-height: 1.6;
        }

        /* ================================================
           DISCLAIMER
        ================================================ */

        .disclaimer {
          margin-top: 16px;
          padding: 13px 15px;
          border: 1px dashed #D7CFBF;
          border-radius: 14px;
          color: #8A8F93;
          font-size: 10px;
          line-height: 1.7;
        }

        /* ================================================
           FOOTER
        ================================================ */

        .footer {
          max-width: 1240px;
          margin: 70px auto 0;
          padding: 22px 28px 35px;
          border-top: 1px solid #DDD7CC;
          display: flex;
          justify-content: space-between;
          color: #9A9B99;
          font-size: 10px;
        }

        /* ================================================
           ANIMATIONS
        ================================================ */

        @keyframes trainRide {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(
              calc(100vw + 460px)
            );
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }

          50% {
            opacity: .45;
            transform: scale(.75);
          }
        }

        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ================================================
           NIGHT MODE
        ================================================ */

        .theme-toggle {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid #E4DED2;
          background: white;
          color: #68717C;
          border-radius: 100px;
          padding: 9px 13px;
          font-size: 11px;
          font-weight: 750;
          cursor: pointer;
          transition: all .25s ease;
          box-shadow: 0 3px 0 #D9D2C4;
        }

        .theme-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 0 #D9D2C4;
        }

        .theme-icon {
          font-size: 14px;
          line-height: 1;
        }

        .metro-page.night-mode {
          background:
            radial-gradient(circle at 12% 0%, rgba(73, 91, 128, .25), transparent 25%),
            radial-gradient(circle at 88% 12%, rgba(226, 83, 79, .08), transparent 22%),
            #0B1118;
          color: #F4F1EA;
        }

        .metro-page.night-mode::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: .38;
          background-image:
            radial-gradient(circle, #FFFFFF 1px, transparent 1.5px),
            radial-gradient(circle, #FFFFFF .7px, transparent 1.2px);
          background-size: 92px 92px, 137px 137px;
          background-position: 13px 22px, 51px 8px;
          z-index: 0;
        }

        .metro-page.night-mode > * {
          position: relative;
          z-index: 1;
        }

        .night-mode .brand-mark {
          background: #F4F1EA;
          color: #101821;
          box-shadow: 4px 5px 0 #263341;
        }

        .night-mode .brand-sub,
        .night-mode .hero-text,
        .night-mode .results-sub {
          color: #8D99A7;
        }

        .night-mode .theme-toggle {
          background: #17212D;
          border-color: #344252;
          color: #F4F1EA;
          box-shadow: 0 3px 0 #263341;
        }

        .night-mode .theme-toggle:hover {
          box-shadow: 0 5px 0 #263341;
        }

        .night-mode .live-pill {
          background: #141D27;
          border-color: #2C3947;
          color: #A8B2BE;
        }

        .night-mode .train-scene {
          border-bottom-color: #293541;
        }

        .night-mode .city {
          background: #1D2833;
          opacity: .9;
        }

        .night-mode .city::before,
        .night-mode .city::after {
          background: #344352;
          box-shadow:
            14px 0 #344352,
            28px 0 #344352,
            0 13px #344352,
            14px 13px #344352,
            28px 13px #344352;
        }

        .night-mode .rail {
          background: #526171;
        }

        .night-mode .rail-two {
          opacity: .2;
        }

        .night-mode .track-glow {
          opacity: .25;
        }

        .night-mode .track-station {
          background: #E8E1D5;
        }

        .night-mode .train-wheel {
          border-color: #0B1118;
        }

        .night-mode .route-count {
          background: #151E28;
          border-color: #2C3947;
          color: #AAB3BE;
        }

        .night-mode .route-card {
          background: #151E28;
          border-color: #2D3A48;
          box-shadow: 0 14px 35px rgba(0,0,0,.22);
        }

        .night-mode .route-card:hover {
          box-shadow: 0 22px 45px rgba(0,0,0,.32);
        }

        .night-mode .metric {
          background: #1D2834;
        }

        .night-mode .line-pill {
          background: #1B2632;
          border-color: #33404E;
          color: #C1C8D0;
        }

        .night-mode .crowd-track {
          background: #303C49;
        }

        .night-mode .seat-box {
          background: #1A2530;
          border-color: #303D4A;
        }

        .night-mode .worst-station {
          color: #C5CCD4;
        }

        .night-mode .route-map {
          border-top-color: #34404D;
        }

        .night-mode .normal-node {
          border-color: #151E28;
          box-shadow: 0 0 0 1px #66717D;
        }

        .night-mode .terminal-node {
          border-color: #151E28;
        }

        .night-mode .interchange-node {
          background: #151E28;
        }

        .night-mode .interchange-node b,
        .night-mode .interchange-node span {
          box-shadow: 0 0 0 0 transparent;
        }

        .night-mode .interchange-node b {
          border-color: #151E28;
        }

        .night-mode .station-label {
          color: #8F9AA6;
        }

        .night-mode .terminal-label {
          color: #E9E4DB;
        }

        .night-mode .change-label {
          background: #202B37;
        }

        .night-mode .change-label span,
        .night-mode .change-label i {
          color: #8995A2;
        }

        .night-mode .disclaimer {
          border-color: #34404D;
          color: #7F8B98;
        }

        .night-mode .comparison {
          box-shadow: 5px 5px 0 #263341;
        }

        .night-mode .footer {
          border-top-color: #293541;
          color: #687482;
        }

        .night-mode .planner-card {
          box-shadow:
            0 20px 50px rgba(0,0,0,.34),
            6px 6px 0 #263341;
        }

        .night-mode .eyebrow {
          color: #B5A18B;
        }

        /* ================================================
           RESPONSIVE
        ================================================ */

        @media (max-width: 1000px) {

          .planner-grid {
            grid-template-columns: 1fr 1fr;
          }

          .route-grid {
            grid-template-columns: 1fr;
          }

          .comparison-grid {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 650px) {

          .topbar,
          .hero,
          .planner,
          .results,
          .footer {
            padding-left: 17px;
            padding-right: 17px;
          }

          .live-pill {
            display: none;
          }

          .hero h1 {
            font-size: 48px;
            letter-spacing: -2.5px;
          }

          .planner-grid {
            grid-template-columns: 1fr;
          }

          .planner-card {
            padding: 16px;
          }

          .results-head {
            align-items: flex-start;
          }

          .results-title {
            font-size: 26px;
          }

          .footer {
            flex-direction: column;
            gap: 8px;
          }

        }

      `}</style>


      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            🚇
          </div>

          <div>

            <div className="brand-name">
              MetroFlow
            </div>

            <div className="brand-sub">
              Delhi, but smarter.
            </div>

          </div>

        </div>


        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          <div className="live-pill">
            <span className="live-dot" />
            Journey engine ready
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={nightMode ? "Switch to day mode" : "Switch to night mode"}
            type="button"
          >
            <span className="theme-icon">{nightMode ? "☀" : "☾"}</span>
            <span>{nightMode ? "Day Mode" : "Night Mode"}</span>
          </button>

        </div>

      </header>


      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="hero">

        <div className="hero-copy">

          <span className="eyebrow">
            YOUR DAILY METRO COMPANION
          </span>

          <h1>
            Find your way.
            <br />
            <em>Beat the crowd.</em>
          </h1>

          <p className="hero-text">
            MetroFlow compares routes across travel time,
            interchanges and modelled crowd conditions —
            so you can choose the ride that actually
            fits your day.
          </p>

        </div>


        {/* Animated train */}
        <AnimatedTrain />

      </section>


      {/* ======================================================
          PLANNER
      ====================================================== */}

      <section className="planner">

        <div className="planner-card">

          <div className="planner-title">
            Plan a journey
          </div>

          <div className="planner-grid">

            <div className="field">

              <label>
                FROM
              </label>

              <div className="autocomplete-wrap">
                <input
                  value={source}
                  onFocus={() => {
                    setSourceFocused(true);
                    setSourceSuggestions(
                      getSuggestions(source)
                    );
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSource(value);
                    setSourceSuggestions(
                      getSuggestions(value)
                    );
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setSourceFocused(false);
                    }, 150);
                  }}
                  placeholder="Rithala"
                  autoComplete="off"
                />

                {sourceFocused &&
                  sourceSuggestions.length > 0 && (
                    <div className="station-suggestions">
                      {sourceSuggestions.map((station) => (
                        <button
                          type="button"
                          key={station}
                          className="station-suggestion"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSource(station);
                            setSourceSuggestions([]);
                            setSourceFocused(false);
                          }}
                        >
                          <span className="suggestion-icon">
                            🚇
                          </span>
                          <span>{station}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>

            </div>


            <div className="field">

              <label>
                TO
              </label>

              <div className="autocomplete-wrap">
                <input
                  value={destination}
                  onFocus={() => {
                    setDestinationFocused(true);
                    setDestinationSuggestions(
                      getSuggestions(destination)
                    );
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDestination(value);
                    setDestinationSuggestions(
                      getSuggestions(value)
                    );
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setDestinationFocused(false);
                    }, 150);
                  }}
                  placeholder="Rajiv Chowk"
                  autoComplete="off"
                />

                {destinationFocused &&
                  destinationSuggestions.length > 0 && (
                    <div className="station-suggestions">
                      {destinationSuggestions.map((station) => (
                        <button
                          type="button"
                          key={station}
                          className="station-suggestion"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setDestination(station);
                            setDestinationSuggestions([]);
                            setDestinationFocused(false);
                          }}
                        >
                          <span className="suggestion-icon">
                            🚇
                          </span>
                          <span>{station}</span>
                        </button>
                      ))}
                    </div>
                  )}
              </div>

            </div>


            <div className="field">

              <label>
                DEPARTURE
              </label>

              <div className="time-picker">

  <select
    value={
      (() => {
        const hour = Number(
          departureTime.split(":")[0]
        );
        return String(hour % 12 || 12);
      })()
    }
    onChange={(e) => {
      const [, minute] =
        departureTime.split(":");

      const currentHour = Number(
        departureTime.split(":")[0]
      );

      const isPM = currentHour >= 12;

      let newHour = Number(e.target.value);

      if (isPM && newHour !== 12) {
        newHour += 12;
      }

      if (!isPM && newHour === 12) {
        newHour = 0;
      }

      setDepartureTime(
        `${String(newHour).padStart(2, "0")}:${minute}`
      );
    }}
  >
    {Array.from(
      { length: 12 },
      (_, i) => i + 1
    ).map((hour) => (
      <option
        key={hour}
        value={hour}
      >
        {hour}
      </option>
    ))}
  </select>

  <span>:</span>

  <select
    value={departureTime.split(":")[1]}
    onChange={(e) => {
      const [hour] =
        departureTime.split(":");

      setDepartureTime(
        `${hour}:${e.target.value}`
      );
    }}
  >
    {Array.from(
      { length: 60 },
      (_, i) => {
        const minute = String(i).padStart(2, "0");

        return (
          <option
            key={minute}
            value={minute}
          >
            {minute}
          </option>
        );
      }
    )}
  </select>

  <select
    value={
      Number(
        departureTime.split(":")[0]
      ) >= 12
        ? "PM"
        : "AM"
    }
    onChange={(e) => {
      const [hourString, minute] =
        departureTime.split(":");

      let hour = Number(hourString);

      if (
        e.target.value === "PM" &&
        hour < 12
      ) {
        hour += 12;
      }

      if (
        e.target.value === "AM" &&
        hour >= 12
      ) {
        hour -= 12;
      }

      setDepartureTime(
        `${String(hour).padStart(2, "0")}:${minute}`
      );
    }}
  >
    <option value="AM">AM</option>
    <option value="PM">PM</option>
  </select>

</div>

            </div>


            <button
              className="plan-button"
              onClick={planJourney}
              disabled={loading}
            >
              {loading
                ? "Finding routes..."
                : "Plan my ride →"}
            </button>

          </div>


          {error && (
            <div className="error">
              {error}
            </div>
          )}

        </div>

      </section>


      {/* ======================================================
          RESULTS
      ====================================================== */}

      {result && (

        <section className="results">

          <div className="results-head">

            <div>

              <span className="eyebrow">
                ROUTE OPTIONS
              </span>

              <h2 className="results-title">

                {result.source}
                {" "}
                <span style={{ color: "#E2534F" }}>
                  →
                </span>
                {" "}
                {result.destination}

              </h2>

            <p className="results-sub">
              Leaving at {formatTime12Hour(result.departure_time)}
              {" · "}
              Crowd profile{" "}
              {formatTime12Hour(
                `${String(result.crowd_profile_hour).padStart(2, "0")}:00`
              )}
            </p>

            </div>


            <div className="route-count">
              {result.route_count} ways to go
            </div>

          </div>


          {/* ROUTE CARDS */}

          <div className="route-grid">

            {result.routes.map(
              (route, index) => {

                const badge =
                  getBadge(route.type);

                const avgCrowd =
                  route.crowd_summary
                    .average_crowd_score ?? 0;

                const avgSeat =
                  route.crowd_summary
                    .average_estimated_seat_likelihood_pct ??
                  0;

                const worstSeat =
                  route.crowd_summary
                    .worst_estimated_seat_likelihood_pct ??
                  0;

                const worstStation =
                  route.crowd_summary
                    .worst_station_name ??
                  "Unknown station";

                const topClass =
                  route.type === "FASTEST"
                    ? "top-fastest"
                    : route.type === "COMFORTABLE"
                    ? "top-comfort"
                    : route.type === "BALANCED"
                    ? "top-balanced"
                    : "top-default";


                return (

                  <article
                    className="route-card"
                    key={`${route.type}-${index}`}
                  >

                    <div
                      className={`route-card-top ${topClass}`}
                    />


                    <div className="route-content">


                      {/* BADGE */}

                      <div className="route-heading">

                        <span
                          className={`route-badge ${badge.className}`}
                        >
                          <span>
                            {badge.icon}
                          </span>

                          {badge.text}

                        </span>

                        <span className="option-number">
                          OPTION {index + 1}
                        </span>

                      </div>


                      {/* TIME / INTERCHANGE */}

                      <div className="big-metrics">

                        <div className="metric">

                          <div className="metric-label">
                            Travel time
                          </div>

                          <div className="metric-value">

                            {route.travel_time_minutes}

                            <span className="metric-unit">
                              min
                            </span>

                          </div>

                        </div>


                        <div className="metric">

                          <div className="metric-label">
                            Interchanges
                          </div>

                          <div className="metric-value">
                            {route.interchange_count}
                          </div>

                        </div>

                      </div>


                      {/* LINES */}

                      <div className="section-label">
                        METRO LINES
                      </div>

                      <div className="line-list">

                        {route.lines_used.map(
                          (line) => (

                            <span
                              className="line-pill"
                              key={line}
                            >

                              <span
                                className="line-dot"
                                style={{
                                  background:
                                    getLineColor(line),
                                }}
                              />

                              {line}

                            </span>

                          )
                        )}

                      </div>


                      {/* CROWD */}

                      <div className="crowd-block">

                        <div className="crowd-head">

                          <span className="metric-label">
                            Modelled crowd
                          </span>

                          <span
                            className="crowd-score"
                            style={{
                              color:
                                getCrowdColor(
                                  avgCrowd
                                ),
                            }}
                          >
                            {avgCrowd.toFixed(1)}
                          </span>

                        </div>


                        <div className="crowd-track">

                          <div
                            className="crowd-fill"
                            style={{
                              width: `${Math.min(
                                avgCrowd,
                                100
                              )}%`,
                              background:
                                getCrowdColor(
                                  avgCrowd
                                ),
                            }}
                          />

                        </div>

                      </div>


                      {/* SEATS */}

                      <div className="seat-grid">

                        <div className="seat-box">

                          <div className="seat-label">
                            AVG SEAT CHANCE
                          </div>

                          <div className="seat-value seat-green">
                            {avgSeat.toFixed(1)}%
                          </div>

                        </div>


                        <div className="seat-box">

                          <div className="seat-label">
                            LOWEST SEAT CHANCE
                          </div>

                          <div
                            className="worst-station"
                            title={worstStation}
                          >
                            {worstStation}
                          </div>

                          <div className="seat-value seat-orange">
                            {worstSeat.toFixed(1)}%
                          </div>

                        </div>

                      </div>


                      {/* ROUTE MAP */}

                      <MetroRoute
                        route={route}
                      />


                      {/* SCORE */}

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginTop: 17,
                          paddingTop: 13,
                          borderTop:
                            "1px dashed #DDD6CA",
                          fontSize: 10,
                        }}
                      >

                        <span
                          style={{
                            color: "#969B9F",
                          }}
                        >
                          Trade-off score
                        </span>

                        <strong>
                          {route.route_score}
                        </strong>

                      </div>

                    </div>

                  </article>

                );
              }
            )}

          </div>


          {/* ==================================================
              COMPARISON
          ================================================== */}

          <div className="comparison">

            <span
              className="eyebrow"
              style={{ color: "#8D98A5" }}
            >
              CHOOSE YOUR VIBE
            </span>

            <h3 className="comparison-title">
              Same destination. Different kind of ride.
            </h3>


            <div className="comparison-grid">

              <div className="comparison-item">

                <div className="comparison-icon">
                  ⚡
                </div>

                <h4>
                  Fastest
                </h4>

                <p>
                  For when you just want to get
                  there. Time comes first.
                </p>

              </div>


              <div className="comparison-item">

                <div className="comparison-icon">
                  ☁️
                </div>

                <h4>
                  Comfortable
                </h4>

                <p>
                  Lower modelled crowd and better
                  estimated chances of getting a seat.
                </p>

              </div>


              <div className="comparison-item">

                <div className="comparison-icon">
                  ◐
                </div>

                <h4>
                  Balanced
                </h4>

                <p>
                  A middle ground between time,
                  crowd, seats and interchanges.
                </p>

              </div>

            </div>

          </div>


          {/* DISCLAIMER */}

          <div className="disclaimer">

            <strong>
              A small reality check:
            </strong>{" "}

            {result.disclaimer}

            {" "}
            Crowd profiles are currently hourly,
            so journeys within the same hour use
            the same modelled profile.

          </div>

        </section>

      )}


      {/* ======================================================
          FOOTER
      ====================================================== */}

      <footer className="footer">

        <span>
          MetroFlow · Delhi Metro Data Engineering
        </span>

        <span>
          GTFS · Snowflake · Databricks · FastAPI
        </span>

      </footer>

    </main>
  );
}