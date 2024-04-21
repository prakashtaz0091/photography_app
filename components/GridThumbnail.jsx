import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";

const GridThumbnail = ({ grid, setGrid, selctedGrid }) => {
  const selected = selctedGrid.name === grid.name;

  return (
    <TouchableOpacity
      style={[
        styles.gridThumbnailContainer,
        {
          borderColor: "black",
          borderWidth: selected ? 3 : 1,
          backgroundColor: selected ? "teal" : "lightblue",
          opacity: selected ? 0.5 : 1,
          elevation: selected ? 5 : 0,
        },
      ]}
      onPress={() => setGrid(grid)}
    >
      <Image style={styles.gridThumbnail} source={grid.url} />
      <Text style={{ textAlign: "center" }}>
        {grid.name.replaceAll("_", " ")}
      </Text>
    </TouchableOpacity>
  );
};

export default GridThumbnail;

const styles = StyleSheet.create({
  gridThumbnailContainer: {
    height: 100,
    aspectRatio: 3 / 4,
    // backgroundColor: "",
    margin: 6,
    elevation: 5,
  },
  gridThumbnail: {
    height: "100%",
    width: "100%",
  },
});
