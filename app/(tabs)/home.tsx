import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import HomeIcon from '../../assets/images/home.svg';
import MapIcon from '../../assets/images/map.svg';
import StarIcon from '../../assets/images/star.svg';
import IconButton from '../../components/IconButton';

export default function home() {
  
  const router = useRouter();
  
  return (
          <View style={styles.mainWrapper}>
        
          <View style={styles.taskBar}>
            {/* Icon 1: Home */}
            <IconButton 
              IconComponent={HomeIcon}  
              size={40}                 
              onPress={() => router.push('/home')} 
            />
          
          {/* Icon 3: Map */}
          <IconButton 
            IconComponent={MapIcon}
            size={40}
            onPress={() => router.push('/mapScreen')}
          />

          {/* Icon 3: Star */}
          <IconButton 
            IconComponent={StarIcon}
            size={40}
            onPress={() => router.push('/favoriteScreen')}
          />
          
        </View>
      </View>
    );
  }

const modalStyles = StyleSheet.create({
  closeButtonContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 1,
  },
});
const styles = StyleSheet.create({
  mainWrapper: {
    flex:1,
    backgroundColor: '#25292e',
  },
  taskBar: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333',
  },

  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  image: {
    width: 80,
    height: 80,
  }
});

