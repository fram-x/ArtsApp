import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    maxWidth: 120,
    paddingTop: 2,
  },
  value: {
    maxWidth: 120,
    paddingTop: 2,
    fontSize: 11,
  },
  imageContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 57,
    width: 57,
    borderRadius: 57 * 0.5,
  },
  smallImageContainer: {
    backgroundColor: '#CCC',
    marginLeft: 10,
    marginRight: 10,
  }
});
