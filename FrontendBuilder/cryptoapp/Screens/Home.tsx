import  React, {useEffect, useState} from 'react';
import { View, Text, Pressable,FlatList, StyleSheet,TouchableOpacity} from 'react-native';
import {crypto} from '../models/crypto'
import io from 'socket.io-client'

const socket = io('http://127.0.0.1:3000')



// socket.on('cryto', data => {
//     setCryptoList(data)
// })



export const  Home = ({ navigation}: {navigation : any}) => {
   const  [cryptoList, setCryptoList] = useState();
   
   useEffect(() => {
        socket.on('cryto', data => {
        setCryptoList(data)
        })
   },[])

    const crytoDetails = ((id:string) => {
        navigation.navigate('Details',{id:id})
    })

    const renderItem = ({item}:{item:crypto}) => (
        <TouchableOpacity style={styles.itemBanner} onPress={() => crytoDetails(item.id)}>
          <Text style={styles.text}>{item.name}</Text>
          <Text style={styles.price}>{Math.round(item.price * 100) /100}</Text>
        </TouchableOpacity>
      );
   
   
  return (
    <View style={styles.container}>
    <FlatList
    data={cryptoList}
    renderItem={renderItem}
    keyExtractor={item => item.id}
    />
    </View>
  );
}

const styles = StyleSheet.create({
    container:{ 
        flex: 1,
        backgroundColor:"#272d42",
        },
    itemBanner:{
        borderRadius:5,
        borderWidth:1,
        backgroundColor:"#000",
        padding:20,
        flex:1,
        margin:10,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    text:{
        color:'#f4f3f2',
        fontSize:24,
    },
    price:{
        color:"#ffab00",
        fontSize:28
    }
})