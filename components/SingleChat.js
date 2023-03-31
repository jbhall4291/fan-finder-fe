import React from "react";
import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import { useState, useEffect } from "react";
import { getChatHistoryById } from "../utils/api";
import { socket } from "../App";

export const SingleChat = ({route}) => {

    const chatId = route.params.id
    const room = route.params.room
    const [text, setText] = useState('Send a message...');

    const [messages, setMessages] = useState([])
    useEffect(()=>{
        setMessages(getChatHistoryById(chatId))
    },[])
    
    useEffect(()=>{
        socket.on('send_message', (data) => {
            console.log('getting message')
            setMessages(...messages,data)
            // Add new messages to list of messages
        })
    }, [socket])

    return (
        <View>
            <View>

            {messages?.map((msg)=>{
                return (
                    <Text >{msg.msg}</Text> // android bugs here adding chat id
                )
            })}
            <TextInput 
                onChangeText= {(text) => {setText(text)} }
                value={text}
                >
            </TextInput>
            
            </View>
            <View>
                <Button title={"send"} onPress={()=>{
                    socket.emit('send_message', {msg: text})
                    setMessages([...messages, {msg: text}])
                    console.log("sending message")
                    setText("Send a message...")

                }}></Button>
            </View>
        </View>
    )
}