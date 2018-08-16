import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    justifyContent: 'center',
    borderBottomColor: '#CCC',
    borderBottomWidth: 1,
    overflow: 'hidden'
  },
  emptyContainer:{
    alignItems: 'center',
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    backgroundColor: 'transparent'
  },
  header: {
    fontWeight: 'bold',
  },
  description: {
    paddingTop: 8,
  },
  headerContainer: {
    padding: 12,
    paddingBottom: 10,
  },
});
