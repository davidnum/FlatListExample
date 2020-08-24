import React, {useState, useRef} from 'react';
import {
  Animated,
  View,
  Text,
  RefreshControl,
  Platform,
  StyleSheet,
} from 'react-native';

const isIos = Platform.OS === 'ios';
const HEADER_HEIGHT = 150;

const interpolateAnimation = isIos
  ? {
      inputRange: [-150, 0],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: 'clamp',
    }
  : {
      inputRange: [0, HEADER_HEIGHT],
      outputRange: [0, -HEADER_HEIGHT],
      extrapolate: 'clamp',
    };

const items = Array.from(Array(25).keys());
const keyExtractor = (item) => `${item}`;
const renderItem = ({item}) => (
  <View style={styles.itemContainer}>
    <Text>Item: {item}</Text>
  </View>
);

const wait = (timeout) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const Separator = () => <View style={styles.separator} />;

const App = () => {
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [
              {
                translateY: scrollY.interpolate(interpolateAnimation),
              },
            ],
          },
        ]}>
        <Text style={styles.headerText}>Header</Text>
      </Animated.View>
      <Animated.FlatList
        contentContainerStyle={styles.listContainer}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        data={items}
        contentInset={{top: HEADER_HEIGHT}}
        contentOffset={{y: -HEADER_HEIGHT}}
        refreshControl={
          <RefreshControl
            progressViewOffset={HEADER_HEIGHT}
            tintColor="black"
            titleColor="black"
            onRefresh={onRefresh}
            refreshing={refreshing}
          />
        }
        ItemSeparatorComponent={Separator}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    padding: 30,
    height: HEADER_HEIGHT,
    backgroundColor: 'lightgrey',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
  },
  listContainer: {
    paddingTop: isIos ? 0 : HEADER_HEIGHT,
  },
  itemContainer: {
    height: 70,
    padding: 20,
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
  },
});
