import React from "react";
import ReactDOM from "react-dom";
import {
  ThemeProvider,
  ColorModeProvider,
  CSSReset,
  Switch,
  Stack,
  Flex,
  Box,
  FormLabel,
  Text,
  Grid,
} from "@chakra-ui/core";

import { races, resources } from "./data";

import "./styles.css";

function selectedRacesReducer(state, action) {
  switch (action.type) {
    case "add": {
      return [...state, action.payload.id];
    }
    case "remove": {
      return state.filter(id => id !== action.payload.id);
    }
    default: {
      throw Error("Unknown action type");
    }
  }
}

function calculateResourceRankings(selectedRaces) {
  const resourceRankings = {};
  selectedRaces.forEach(race => {
    const raceResources = race.resources;
    raceResources.forEach(resourceId => {
      if (resourceId in resourceRankings) {
        resourceRankings[resourceId] += 1;
      } else {
        resourceRankings[resourceId] = 1;
      }
    });
  });
  return resourceRankings;
}

function SmallCube(props) {
  const { color, ...rest } = props;
  return <Box border="2px solid gray" bg={color} w={6} h={6} {...rest} />;
}

function LargeCube(props) {
  const { color, ...rest } = props;
  return <Box border="2px solid gray" bg={color} w={10} h={10} {...rest} />;
}

function Octogon(props) {
  const { color } = props;
  return (
    <svg width="40px" height="40px" viewBox="0 0 200 200" version="1.1">
      <polygon
        fill={color}
        stroke="grey"
        strokeWidth="10px"
        points="136.737609507049,188.692435121084 63.2623904929514,188.692435121084 11.3075648789165,136.737609507049 11.3075648789165,63.2623904929514 63.2623904929513,11.3075648789165 136.737609507049,11.3075648789165 188.692435121084,63.2623904929513 188.692435121084,136.737609507049"
      />
    </svg>
  );
}

const resourceShapes = {
  small: SmallCube,
  large: LargeCube,
  octogon: Octogon,
};

function Resources({ selectedRaces }) {
  const resourceRankings = calculateResourceRankings(selectedRaces);
  const maxResourceRanking = Math.max(...Object.values(resourceRankings));
  return (
    <Grid
      templateColumns="repeat(7, 1fr)"
      alignItems="center"
      justifyItems="center"
    >
      {Object.values(resources).map(resource => {
        const ResourceComponent = resourceShapes[resource.type];
        const resourceRanking = resourceRankings[resource.id] || 0;
        const isMaxResource = resourceRanking === maxResourceRanking;
        const textStyles = isMaxResource
          ? { textDecoration: "underline", fontWeight: 800 }
          : {};
        return (
          <>
            <ResourceComponent color={resource.color} />
            <Text {...textStyles} textAlign="center" gridRow={2}>
              {resourceRanking}
            </Text>
          </>
        );
      })}
    </Grid>
  );
}

function RaceInputs({ selectedRaceIds, dispatch }) {
  return (
    <Stack>
      {Object.values(races).map(race => {
        const isSelected = selectedRaceIds.includes(race.id);
        return (
          <Flex margin={2} justifyContent="space-between">
            <FormLabel htmlFor={race.name}>{race.name}</FormLabel>
            <Switch
              id={race.name}
              size="lg"
              isChecked={isSelected}
              onChange={() => {
                const payload = { id: race.id };
                isSelected
                  ? dispatch({ type: "remove", payload })
                  : dispatch({ type: "add", payload });
              }}
            />
          </Flex>
        );
      })}
    </Stack>
  );
}

function App() {
  const [selectedRaceIds, dispatch] = React.useReducer(
    selectedRacesReducer,
    []
  );
  const selectedRaces = Object.values(races).filter(race =>
    selectedRaceIds.includes(race.id)
  );

  return (
    <Stack w={["100%", null, "50%", "25%"]} mx="auto" mt={2}>
      <Resources selectedRaces={selectedRaces} />
      <RaceInputs selectedRaceIds={selectedRaceIds} dispatch={dispatch} />
    </Stack>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(
  <ThemeProvider>
    <CSSReset />
    <ColorModeProvider value="light">
      <App />
    </ColorModeProvider>
  </ThemeProvider>,
  rootElement
);
