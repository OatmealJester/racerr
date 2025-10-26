import { StyleSheet, Text, View } from 'react-native';

export default function favoriteScreen(){
return(
  <View style={styles.mainWrapper}>
    <Text> Favorites </Text>
  </View>
  );
}

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

