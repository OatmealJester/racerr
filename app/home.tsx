import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import HomeIcon from '../assets/images/home.svg';
import MapIcon from '../assets/images/map.svg';
import StarIcon from '../assets/images/star.svg';
import IconButton from '../components/IconButton';



export default function home() {
  
  const router = useRouter();
  
  return (
    
    /* Main Page Content */
    <View style={styles.mainWrapper}>
      <View style={styles.container}>
        <Text style={styles.text}> YAy </Text>
      </View>
    
    {/* Taskbar Content */}
    <View style={styles.taskBar}>

      {/* Icon 1: Home */}
        <IconButton 
          IconComponent={HomeIcon}  
          size={40}                 
          onPress={() => router.push('./home')} 
        />
          
      {/* Icon 3: Map */}
        <IconButton 
          IconComponent={MapIcon}
          size={40}
          onPress={() => router.push('./mapScreen')}
        />

      {/* Icon 3: Star */}
        <IconButton 
          IconComponent={StarIcon}
          size={40}
          onPress={() => router.push('./favoriteScreen')}
        />
      </View>    
    </View>
    );
  }

const styles = StyleSheet.create({
  mainWrapper: {
    flex:1,
    backgroundColor: '#25292e',
    flexDirection: 'column',
  },
  taskBar: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    backgroundColor: "#E02a24",
    alignItems: "center",
    justifyContent: "space-around",
  },


  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 10,
  },
  image: {
    width: 80,
    height: 80,
  }
});

