import React from 'react';
import { Text, StyleSheet, View, Dimensions } from 'react-native';
import { HStack, NativeBaseProvider, Spinner } from 'native-base';

export default Loading = () => {
	return (
		<NativeBaseProvider>
			<View style={styles.loading}>
				<HStack space={2} alignItems={'center'}>
					<Spinner accessibilityLabel="Saving" />
					<Text style={styles.text}>
						Loading...
					</Text>
				</HStack>
			</View>
		</NativeBaseProvider>
	)
}

const styles = StyleSheet.create({
	loading: {
		height: Dimensions.get('window').height,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 20,
	}
});