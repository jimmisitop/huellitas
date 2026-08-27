import { FlatList, ScrollView, Text, View } from "react-native";
import "../../../global.css";
import ReelCard from "../../components/reelCard";
import StoryCard from "../../components/storyCard";
import usersFake from "../../constants/dataUsersFake.json";
import reelsFake from "../../constants/reelsUsersFake.json";

export default function HomeScreen() {
  const stories = usersFake.map((user) => ({
    id: user.id,
    author: user.author,
    hasViewed: user.hasViewed,
    image: user.image,
  }));

  const reels = reelsFake.map((reel) => ({
    id: reel.id,
    title: reel.title,
    author: reel.author,
    description: reel.description,
    likes: reel.likes,
    image: reel.image,
  }));

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <ScrollView className="flex-1">
        <View className="bg-white dark:bg-gray-950 py-2 border-b-2 border-gray-200 dark:border-gray-800">
          <View className="mx-5 my-2">
            <Text className="text-xl font-bold">Cachistorias</Text>
          </View>
          <FlatList
            data={stories}
            renderItem={({ item }) => (
              <StoryCard
                image={item.image}
                author={item.author}
                hasViewed={item.hasViewed}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        <View className="pt-4">
          {reels.map((reel, index) => (
            <ReelCard
              key={index}
              title={reel.title}
              author={reel.author}
              image={reel.image}
              description={reel.description}
              likes={reel.likes}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
