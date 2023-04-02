import React from "react";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput } from "react-native";
import { Button } from "@rneui/base";

import { getGigComments } from "../utils/api";

import { CommentCard } from "./CommentCard";
import { postComment } from "../utils/api";

export const ForumCard = ({ route }) => {
  const id = route.params.msg;
  const fullGigInfo = route.params.infoForGig;
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [haveCommentsLoaded, setHaveCommentsLoaded] = useState(false);

  const commentInputBoxRef = useRef(null); // used by the button so it can 'blur' the input and hide the virtual keyboard

  const submitComment = () => {
    commentInputBoxRef.current.blur();
    postComment({ id, commentText }).then((returnedComment) => {
      setCommentText("");
      setComments((currentComments) => {
        console.log(returnedComment, "returned comment in forumcard");
        return [returnedComment, ...currentComments];
      });
    });
  };

  useEffect(() => {
    getGigComments(id).then((data) => {
      setComments(data.reverse());
      setHaveCommentsLoaded(true);
      console.log(comments);
    });
  }, []);

  const ForumCardHeader = () => {
    return (
      <View style={styles.ForumCardHeader}>
        <Text>This is the forum for</Text>
        <Text>{fullGigInfo.name}</Text>
        <Text>At: {fullGigInfo._embedded.venues[0].name}</Text>
        <Text>On: {fullGigInfo.dates.start.localDate}</Text>
        <Text>Join the discussion!</Text>
      </View>
    );
  };

  const CommentsDisplayer = () => {
    return haveCommentsLoaded ? (
      <ScrollView style={styles.ScrollView}>
        {comments.map((comment) => {
          return <CommentCard key={comment._id} comment={comment} />;
        })}
      </ScrollView>
    ) : (
      <Text>comments loading!</Text>
    );
  };

  return (
    <View style={styles.screen}>
      <ForumCardHeader />
      <View style={styles.CommentAdder}>
        <TextInput
          ref={commentInputBoxRef}
          style={styles.CommentTextInput}
          onChangeText={setCommentText}
          placeholder="enter your comment here"
          value={commentText}
          onSubmitEditing={() => submitComment()}
          // blurOnSubmit={true}
        />
        <Button
          title="POST COMMENT!"
          onPress={() => {
            submitComment();
          }}
          color="primary"
          size="lg"
          buttonStyle={{
            width: 200,
            // backgroundColor: "blue"
          }}
          containerStyle={{
            width: 200,
            marginHorizontal: 0,
            marginVertical: 10,
          }}
        />
      </View>

      <CommentsDisplayer />
    </View>
  );
};

//   {comments.length === 0 ? (
//     <Text>no comments!</Text>
//   ) : (
//     comments.map((comment) => {
//       <ScrollView style={styles.ScrollView}>

//       <Text>There be comments</Text>
//         {/* <CommentCard key={comment._id} comment={comment} /> */}
//       </ScrollView>;
//     })
//   )}

//   return comments.length === 0 ? (
//     <View style={styles.screen}>
//       <Text style={styles.titleText}>
//         Join the discussion for {fullGigInfo.name} -
//         {fullGigInfo.dates.start.localDate}
//       </Text>
//       <Text>Be the first to comment!</Text>
//     </View>
//   ) : (
//     <View style={styles.screen}>
//       <Text style={styles.titleText}>
//         Join the discussion for {fullGigInfo.name} -
//         {fullGigInfo.dates.start.localDate}
//       </Text>
//     </View>
//   );
// };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "`#000000`",
  },

  CommentAdder: {
    backgroundColor: "red",
    borderColor: "black",
    // borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 5,
    width: "100%",
    alignItems: "center",
  },

  ForumCardHeader: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    alignItem: "center",
    // backgroundColor: "darkgrey",
    padding: 10,
    borderColor: "black",
    // borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 5,
  },
  CommentTextInput: {
    height: 80,
    width: "90%",
    margin: 5,
    backgroundColor: "green",
  },

  ScrollView: {
    backgroundColor: "grey",
    width: "100%",
    borderColor: "black",
    // borderRadius: 15,
    borderStyle: "solid",
    borderWidth: 5,
  },
});
