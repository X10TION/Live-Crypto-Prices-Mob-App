import React, {useEffect,useState} from 'react';
import { View, Text,ActivityIndicator,StyleSheet } from 'react-native';
import axios from 'axios'
import {API_URL} from '../consts/app-consts'

export const  Details = ({route}:{route:any}) => {
    const id = route.params.id
    const [cryptoProfile,setCryptoProfile] = useState()
    const [market, setMarket] = useState()
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        Promise.all([ 
        axios
            .get(`${API_URL}/cryptos/market-data/${id}`),
        axios
        .get(`${API_URL}/cryptos/profile/${id}`)])
       
        .then(([resMarket,resProfile]) => {
            setMarket(resMarket.data)
            setCryptoProfile(resProfile.data)
            setLoaded(true)
        })
    },[])

  return (<>
    {loaded && (
         <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerinfo}>
                    <Text style={styles.name}>{cryptoProfile.name}</Text>
                </View>
                <View style={styles.headerTag}></View>
            </View>
        
       </View>
    )}
    {!loaded && 
         <ActivityIndicator size="large" color="#272d42" />
    }
   
    </>
  );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#272d42',
        padding:10,
        flex:1,
    },
    header:{
        backgroundColor:"#000",
        height:100,
        padding:10,
        borderRadius:10,
        borderBottom:15,
    },
    headerinfo:{},
    headerTag:{},
    name:{}
})