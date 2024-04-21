import { Camera, CameraType } from "expo-camera";
import { useState, useRef, useEffect } from "react";
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import GridThumbnail from "./components/GridThumbnail";

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [componentHeight, setComponentHeight] = useState(0);
  const [componentWidth, setComponentWidth] = useState(0);
  const cameraRef = useRef(null);
  const [imageUri, setImageUri] = useState(null);

  const GRIDLIST = [
    {
      name: "pyramid",
      url: require("./assets/grids/pyramid.png"),
    },
    {
      name: "rules_of_thirds",
      url: require("./assets/grids/rules_of_thirds.png"),
    },
    {
      name: "golden_triangles",
      url: require("./assets/grids/golden_triangles.png"),
    },
    {
      name: "golden_ratio",
      url: require("./assets/grids/golden_ratio.png"),
    },
  ];
  const [grid, setGrid] = useState(GRIDLIST[0]);

  // useEffect(() => {
  //   setGridUrl(`./assets/grids/${gridType}.png`);
  // }, []);

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  const onLayoutHandler = (event) => {
    const { height, width } = event.nativeEvent.layout;
    setComponentHeight(height);
    setComponentWidth(width);
  };

  const handleTakePicture = async () => {
    if (!cameraRef.current) {
      return;
    }

    try {
      const { uri } = await cameraRef.current.takePictureAsync();
      setImageUri(uri);
      saveToGallery(uri);
    } catch (error) {
      console.error("Error taking picture: ", error);
      Alert.alert("Failed to capture image");
    }
  };

  const saveToGallery = async (imageUri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(imageUri);
      await MediaLibrary.createAlbumAsync("Expo", asset, false);
      Alert.alert("Image saved to gallery!");
    } catch (error) {
      console.error("Error saving image to gallery: ", error);
      Alert.alert("Failed to save image to gallery");
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.cameraWrapper}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={type}
          onLayout={onLayoutHandler}
        ></Camera>
        <Image
          style={[
            styles.image,
            { height: componentHeight, width: componentWidth },
          ]}
          source={grid.url}
        />
      </View>
      <FlatList
        data={GRIDLIST}
        renderItem={({ item }) => (
          <GridThumbnail grid={item} setGrid={setGrid} selctedGrid={grid} />
        )}
        keyExtractor={(item) => item.name}
        horizontal
        style={{ marginTop: 35 }}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTakePicture}>
          {/* <Text style={styles.text}>capture</Text> */}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  cameraWrapper: {
    top: 30,
  },

  camera: {
    width: "100%",
    // height: "100%",
    aspectRatio: 3 / 4,
  },
  buttonContainer: {
    // flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 20,
  },

  button: {
    // flex: 1,
    // alignSelf: "flex-end",
    // alignItems: "center",
    // color: "black",
    height: 70,
    width: 70,
    borderRadius: 50,
    backgroundColor: "lightblue",
    borderWidth: 2,
    borderColor: "azure",
    elevation: 3,
    marginBottom: 40,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
  },
  image: {
    position: "absolute",
  },

  gridsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
