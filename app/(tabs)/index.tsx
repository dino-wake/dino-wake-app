import { AdBanner } from "@/components/alarm/ad-banner";
import { AddAlarmModal } from "@/components/alarm/add-alarm-modal";
import { AlarmCard } from "@/components/alarm/alarm-card";
import { BriefingSection } from "@/components/alarm/briefing-section";
import { DinoEggSection } from "@/components/alarm/dino-egg-section";
import { EditAlarmModal } from "@/components/alarm/edit-alarm-modal";
import { TimeDisplay } from "@/components/alarm/time-display";
import { Box } from "@/components/ui/box";
import { Pressable } from "@/components/ui/pressable";
import { ScrollView } from "@/components/ui/scroll-view";
import { Text } from "@/components/ui/text";
import { Colors } from "@/constants/theme";
import { type Alarm, formatDays, formatTime } from "@/types/alarm";
import { router } from "expo-router";
import { MapIcon, Plus } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const INITIAL_ALARMS: Alarm[] = [
	{
		id: "1",
		hour: 7,
		minute: 0,
		label: "기상",
		memo: "",
		days: [0, 1, 2, 3, 4],
		enabled: true,
		sound: true,
		snooze: false,
	},
	{
		id: "2",
		hour: 9,
		minute: 30,
		label: "주말",
		memo: "",
		days: [5, 6],
		enabled: false,
		sound: true,
		snooze: true,
	},
];

export default function HomeScreen() {
	const [alarms, setAlarms] = useState<Alarm[]>(INITIAL_ALARMS);
	const [showAdd, setShowAdd] = useState(false);
	const [editTarget, setEditTarget] = useState<Alarm | null>(null);

	function handleToggle(id: string, value: boolean) {
		setAlarms((prev) =>
			prev.map((a) => (a.id === id ? { ...a, enabled: value } : a)),
		);
	}

	function handleAdd(data: Omit<Alarm, "id">) {
		const id = Date.now().toString();
		setAlarms((prev) => [...prev, { ...data, id }]);
	}

	function handleEdit(updated: Alarm) {
		setAlarms((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
	}

	function handleDelete(id: string) {
		setAlarms((prev) => prev.filter((a) => a.id !== id));
	}

	return (
		<SafeAreaView className="flex-1 bg-dino-bg">
			<ScrollView
				className="flex-1"
				contentContainerClassName="px-6 pb-10 gap-5"
				showsVerticalScrollIndicator={false}
			>
				<Box className="pt-6">
					<TimeDisplay time="17:30" />
				</Box>

				<DinoEggSection />

				<BriefingSection />

				<AdBanner title="공룡과 함께 더 건강한 아침을 시작해보세요" />

				<Box className="gap-4">
					{alarms.map((alarm) => (
						<AlarmCard
							key={alarm.id}
							time={formatTime(alarm.hour, alarm.minute)}
							label={alarm.label}
							days={formatDays(alarm.days)}
							enabled={alarm.enabled}
							onToggle={(value) => handleToggle(alarm.id, value)}
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
				onSave={handleAdd}
			/>

			<EditAlarmModal
				visible={editTarget !== null}
				alarm={editTarget}
				onClose={() => setEditTarget(null)}
				onSave={handleEdit}
				onDelete={handleDelete}
			/>
		</SafeAreaView>
	);
}
