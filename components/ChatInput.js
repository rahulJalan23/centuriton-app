import React, { useState, useEffect, useRef, memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
} from "react-native";

import Animated, {
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { theme } from "../core/theme";
// import EmojiPicker from "./emojis/EmojiPicker";

// import { useKeyboard } from "@react-native-community/hooks";
// import { theme } from "../../theme";

const ChatInput = ({
  reply,
  closeReply,
  isLeft,
  username,
  message,
  setMessage,
  handleMessageSend,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const height = useSharedValue(70);

  useEffect(() => {
    if (showEmojiPicker) {
      height.value = withTiming(400);
    } else {
      height.value = reply ? withSpring(130) : withSpring(70);
    }
  }, [showEmojiPicker]);

  useEffect(() => {
    if (reply) {
      height.value = showEmojiPicker ? withTiming(450) : withTiming(130);
    } else {
      height.value = showEmojiPicker ? withSpring(400) : withSpring(70);
    }
  }, [reply]);

  const heightAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  });

  return (
    <Animated.View style={[styles.container, heightAnimatedStyle]}>
      <View style={styles.innerContainer}>
        <View style={styles.inputAndMicrophone}>
          <TextInput
            multiline
            placeholder={"Type something..."}
            style={styles.input}
            value={message}
            onChangeText={(text) => setMessage(text)}
          />

          <TouchableOpacity
            style={styles.rightIconButtonStyle}
            onPress={handleMessageSend}
          >
            <Icon name="send" size={20} color={theme.colors.description} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: theme.colors.white,
  },
  replyContainer: {
    paddingHorizontal: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    marginTop: 5,
    fontWeight: "bold",
  },
  closeReply: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  reply: {
    marginTop: 5,
  },
  innerContainer: {
    paddingHorizontal: 0,
    marginHorizontal: 3,
    marginLeft: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 10,
  },
  inputAndMicrophone: {
    flexDirection: "row",
    backgroundColor: theme.colors.inputBackground,
    flex: 3,
    marginRight: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "transparent",
    paddingLeft: 20,
    color: theme.colors.inputText,
    flex: 3,
    fontSize: 15,
    height: 45,
    alignSelf: "center",
  },
  rightIconButtonStyle: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15,
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#fff",
  },
  swipeToCancelView: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 30,
  },
  swipeText: {
    color: theme.colors.description,
    fontSize: 15,
  },
  emoticonButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  recordingActive: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
  },
  recordingTime: {
    color: theme.colors.description,
    fontSize: 20,
    marginLeft: 5,
  },
  microphoneAndLock: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  lockView: {
    backgroundColor: "#eee",
    width: 60,
    alignItems: "center",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 130,
    paddingTop: 20,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ChatInput;
