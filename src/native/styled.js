// @flow

/* eslint-disable import/no-unresolved */
import reactNative from 'react-native'
import type { Target } from '../types'

export default ({
  StyledComponent,
  constructWithOptions,
}: {
  StyledComponent: Function,
  constructWithOptions: Function
}) => {
  const styled = (tag: Target) => constructWithOptions(StyledComponent, tag)

  /* React native lazy-requires each of these modules for some reason, so let's
   *  assume it's for a good reason and not eagerly load them all */
  const aliases = `ActivityIndicator ActivityIndicatorIOS ART Button DatePickerIOS DrawerLayoutAndroid
 Image ImageEditor ImageStore KeyboardAvoidingView ListView MapView Modal Navigator NavigatorIOS
 Picker PickerIOS ProgressBarAndroid ProgressViewIOS ScrollView SegmentedControlIOS Slider
 SliderIOS SnapshotViewIOS Switch RecyclerViewBackedScrollView RefreshControl StatusBar
 SwipeableListView SwitchAndroid SwitchIOS TabBarIOS Text TextInput ToastAndroid ToolbarAndroid
 Touchable TouchableHighlight TouchableNativeFeedback TouchableOpacity TouchableWithoutFeedback
 View ViewPagerAndroid WebView FlatList SectionList VirtualizedList`

  /* Define a getter for each alias which simply gets the reactNative component
   * and passes it to styled */
  aliases.split(/\s+/m).forEach(alias => Object.defineProperty(styled, alias, {
    enumerable: true,
    configurable: false,
    get() {
      return styled(reactNative[alias])
    },
  }))

  return styled
}
