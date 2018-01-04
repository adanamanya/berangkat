import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../components/index.style';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp(percentage) {
  const value = (percentage * viewportWidth) / 100;
  return Math.round(value);
}

const slideHeight = viewportHeight * 0.4;
const movieHeight = viewportHeight * 0.67;
const slideWidth = wp(77);
const itemHorizontalMargin = wp(2);

export const sliderWidth = viewportWidth;
export const itemWidth = slideWidth + itemHorizontalMargin * 2;

const entryBorderRadius = 8;

export default StyleSheet.create({
  slideInnerContainer: {
    width: itemWidth,
    height: movieHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 38, // for shadow
  },
  slideNewsInnerContainer: {
    width: itemWidth,
    height: slideHeight,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 38, // for shadow
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  imageContainerEven: {
    backgroundColor: 'transparent',
  },
  image: {
    height: 50,
    width: 50,
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    borderRadius: Platform.OS === 'ios' ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  // image border fix on ios
  radiusMask: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: 'transparent',
  },
  radiusMaskEven: {
    backgroundColor: 'transparent',
  },
  textContainer: {
    justifyContent: 'center',
    paddingTop: 20 - entryBorderRadius,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: entryBorderRadius,
    borderBottomRightRadius: entryBorderRadius,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20},
    shadowOpacity: 0.30,
    shadowRadius: 10
  },
  textContainerEven: {
    backgroundColor: 'transparent',
  },
  title: {
    color: colors.black,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    justifyContent:'center',
  },
  titleEven: {
    color: 'white',
    fontSize: 17,
    justifyContent:'center',
  },
  subtitle: {
    marginTop: 6,
    color: colors.gray,
    fontSize: 12,
    fontStyle: 'italic',
  },
  subtitleEven: {
    color: 'rgba(255, 255, 255, 0.7)',
  }
});
