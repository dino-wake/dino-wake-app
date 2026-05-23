import { AdBanner } from "@/components/alarm/ad-banner";
import { AddAlarmModal } from "@/components/alarm/add-alarm-modal";
import { AlarmCard } from "@/components/alarm/alarm-card";
import { BriefingSection } from "@/components/alarm/briefing-section";
import { DinoEggSection } from "@/components/alarm/dino-egg-section";
import { EditAlarmModal } from "@/components/alarm/edit-alarm-modal";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { useAlarms } from "@/hooks/use-alarms";
import { type Alarm, formatDays, formatTime, getNextAlarmLabel } from "@/types/alarm";
import { router } from "expo-router";
import { MapIcon, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
	const { alarms, addAlarm, updateAlarm, toggleAlarm, deleteAlarm } = useAlarms();
	const [showAdd, setShowAdd] = useState(false);
	const [editTarget, setEditTarget] = useState<Alarm | null>(null);
	const [nextAlarmLabel, setNextAlarmLabel] = useState('');

	useEffect(() => {
		setNextAlarmLabel(getNextAlarmLabel(alarms));
		const id = setInterval(() => setNextAlarmLabel(getNextAlarmLabel(alarms)), 60000);
		return () => clearInterval(id);
	}, [alarms]);

	return (
		<SafeAreaView className="flex-1 bg-dino-bg">
			<ScrollView
				className="flex-1"
				contentContainerClassName="px-6 pt-16 pb-10 gap-5"
				showsVerticalScrollIndicator={false}
			>
				<DinoEggSection nextAlarmLabel={nextAlarmLabel} />

				<BriefingSection />

				<AdBanner title={"디노 알람과 함께하는\n아침의 시작 ☀️"} />

				<Box className="gap-4">
					{alarms.map((alarm) => (
						<AlarmCard
							key={alarm.id}
							time={formatTime(alarm.hour, alarm.minute)}
							label={alarm.label}
							days={formatDays(alarm.days)}
							enabled={alarm.enabled}
							onToggle={(value) => toggleAlarm(alarm.id, value)}
							onPress={() => setEditTarget(alarm)}
						/>
					))}
				</Box>

				<Box className="items-center pt-2">
					<Pressable
						onPress={() => setShowAdd(true)}
						className="items-center justify-center rounded-full bg-dino-accent-orange"
						style={{
							width: 52,
							height: 52,
							shadowColor: Colors.light.accentOrangeDark,
							shadowOffset: { width: 0, height: 4 },
							shadowOpacity: 0.3,
							shadowRadius: 8,
							elevation: 4,
						}}
					>
						<Plus size={24} color="#FFFFFF" />
					</Pressable>
				</Box>

				<Pressable
					onPress={() => router.push("/temp/sitemap")}
					className="flex-row items-center justify-center gap-1.5"
					style={{ paddingVertical: 8 }}
				>
					<MapIcon size={13} color={Colors.light.icon} />
					<Text
						style={{
							fontSize: 12,
							fontFamily: "Outfit_400Regular",
							color: Colors.light.icon,
						}}
					>
						사이트맵
					</Text>
				</Pressable>
			</ScrollView>

			<AddAlarmModal
				visible={showAdd}
				onClose={() => setShowAdd(false)}
				onSave={addAlarm}
			/>

			<EditAlarmModal
				visible={editTarget !== null}
				alarm={editTarget}
				onClose={() => setEditTarget(null)}
				onSave={updateAlarm}
				onDelete={deleteAlarm}
			/>
		</SafeAreaView>
	);
}
